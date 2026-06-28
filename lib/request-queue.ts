import { promises as fs } from "fs";
import path from "path";

export const REQUEST_DIR = path.join(process.cwd(), "requested-keywords");
export const PROCESSING_TIMEOUT_MS = 30 * 60 * 1000;
export const MAX_ATTEMPTS = 3;
const LOCK_STALE_MS = 60 * 1000;

export type RequestStatus = "pending" | "processing" | "completed" | "failed" | "awaiting_review" | "approved";

export type PostRequest = {
  id: string;
  keyword: string;
  requestedAt: string;
  status: RequestStatus;
  attemptCount: number;
  processingStartedAt?: string;
  completedAt?: string;
  failedAt?: string;
  lastError?: string;
  workerId?: string;
  needReview?: boolean;
  hasReviewed?: boolean;
  compareCount?: number;
};

export class RequestQueueError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_ID" | "NOT_FOUND" | "CONFLICT" | "INVALID_STATE"
  ) {
    super(message);
    this.name = "RequestQueueError";
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

export function isValidRequestId(id: string) {
  return /^\d+$/.test(id);
}

function requestPath(id: string) {
  if (!isValidRequestId(id)) {
    throw new RequestQueueError("올바른 요청 ID가 필요합니다.", "INVALID_ID");
  }
  return path.join(REQUEST_DIR, `${id}.json`);
}

function normalizeRequest(value: unknown): PostRequest {
  if (!value || typeof value !== "object") {
    throw new Error("Request must be an object.");
  }

  const source = value as Record<string, unknown>;
  if (typeof source.id !== "string" || !isValidRequestId(source.id)) {
    throw new Error("Request id is invalid.");
  }
  if (typeof source.keyword !== "string" || !source.keyword.trim()) {
    throw new Error("Request keyword is missing.");
  }
  if (typeof source.requestedAt !== "string" || Number.isNaN(Date.parse(source.requestedAt))) {
    throw new Error("Request timestamp is invalid.");
  }

  const allowedStatuses: RequestStatus[] = ["pending", "processing", "completed", "failed", "awaiting_review", "approved"];
  const status = allowedStatuses.includes(source.status as RequestStatus)
    ? (source.status as RequestStatus)
    : "pending";
  const attemptCount =
    typeof source.attemptCount === "number" && Number.isInteger(source.attemptCount) && source.attemptCount >= 0
      ? source.attemptCount
      : 0;

  const needReview = source.needReview === true;
  const hasReviewed = source.hasReviewed === true;
  const compareCount =
    typeof source.compareCount === "number" && Number.isInteger(source.compareCount) && source.compareCount >= 1
      ? source.compareCount
      : 3;

  const optionalString = (key: string) =>
    typeof source[key] === "string" && source[key] ? (source[key] as string) : undefined;

  return {
    id: source.id,
    keyword: source.keyword.trim(),
    requestedAt: source.requestedAt,
    status,
    attemptCount,
    processingStartedAt: optionalString("processingStartedAt"),
    completedAt: optionalString("completedAt"),
    failedAt: optionalString("failedAt"),
    lastError: optionalString("lastError"),
    workerId: optionalString("workerId"),
    needReview,
    hasReviewed,
    compareCount
  };
}

async function writeJsonAtomically(filePath: string, value: unknown) {
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(value, null, 2), "utf-8");
  try {
    await fs.rename(tempPath, filePath);
  } catch (error) {
    await fs.unlink(tempPath).catch(() => undefined);
    throw error;
  }
}

async function readRequestFile(id: string) {
  try {
    const source = await fs.readFile(requestPath(id), "utf-8");
    return normalizeRequest(JSON.parse(source.replace(/^\uFEFF/, "")));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      throw new RequestQueueError("해당 요청을 찾을 수 없습니다.", "NOT_FOUND");
    }
    throw error;
  }
}

async function acquireRequestLock(id: string) {
  await fs.mkdir(REQUEST_DIR, { recursive: true });
  const lockPath = path.join(REQUEST_DIR, `${id}.lock`);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const handle = await fs.open(lockPath, "wx");
      return { handle, lockPath };
    } catch (error) {
      if (!isNodeError(error) || error.code !== "EEXIST") throw error;

      if (attempt === 0) {
        const stats = await fs.stat(lockPath).catch(() => null);
        if (stats && Date.now() - stats.mtimeMs > LOCK_STALE_MS) {
          await fs.unlink(lockPath).catch(() => undefined);
          continue;
        }
      }
      throw new RequestQueueError("다른 작업자가 이 요청을 처리 중입니다.", "CONFLICT");
    }
  }

  throw new RequestQueueError("요청 잠금을 획득하지 못했습니다.", "CONFLICT");
}

async function withRequestLock<T>(id: string, operation: () => Promise<T>) {
  const { handle, lockPath } = await acquireRequestLock(id);
  try {
    return await operation();
  } finally {
    await handle.close().catch(() => undefined);
    await fs.unlink(lockPath).catch(() => undefined);
  }
}

export async function listPostRequests() {
  await fs.mkdir(REQUEST_DIR, { recursive: true });
  const files = (await fs.readdir(REQUEST_DIR)).filter((file) => file.endsWith(".json"));
  const requests: PostRequest[] = [];

  for (const file of files) {
    try {
      const source = await fs.readFile(path.join(REQUEST_DIR, file), "utf-8");
      requests.push(normalizeRequest(JSON.parse(source.replace(/^\uFEFF/, ""))));
    } catch (error) {
      console.error(`Failed to parse request file: ${file}`, error);
    }
  }

  return requests.sort(
    (a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
  );
}

export async function createPostRequest(keyword: string, needReview = false, compareCount = 3) {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) throw new Error("요청할 키워드를 입력해 주세요.");

  await fs.mkdir(REQUEST_DIR, { recursive: true });
  const now = Date.now();

  for (let offset = 0; offset < 1000; offset += 1) {
    const id = String(now + offset);
    const data: PostRequest = {
      id,
      keyword: normalizedKeyword,
      requestedAt: new Date().toISOString(),
      status: "pending",
      attemptCount: 0,
      needReview,
      compareCount
    };

    try {
      const handle = await fs.open(requestPath(id), "wx");
      try {
        await handle.writeFile(JSON.stringify(data, null, 2), "utf-8");
        await handle.sync();
      } finally {
        await handle.close();
      }
      return data;
    } catch (error) {
      if (isNodeError(error) && error.code === "EEXIST") continue;
      throw error;
    }
  }

  throw new Error("고유한 요청 ID를 생성하지 못했습니다.");
}

export async function claimPostRequest(id: string, workerId = "agent") {
  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    const now = Date.now();

    if (current.status === "completed" || current.status === "failed" || current.status === "awaiting_review") return null;
    if (current.status === "processing") {
      const startedAt = current.processingStartedAt
        ? Date.parse(current.processingStartedAt)
        : Number.NaN;
      const timedOut = Number.isNaN(startedAt) || now - startedAt >= PROCESSING_TIMEOUT_MS;
      if (!timedOut) return null;

      if (current.attemptCount >= MAX_ATTEMPTS) {
        const failed: PostRequest = {
          ...current,
          status: "failed",
          failedAt: new Date(now).toISOString(),
          lastError: `처리 제한 시간 ${PROCESSING_TIMEOUT_MS / 60000}분을 ${MAX_ATTEMPTS}회 초과했습니다.`,
          processingStartedAt: undefined,
          workerId: undefined
        };
        await writeJsonAtomically(requestPath(current.id), failed);
        return null;
      }
    }

    const next: PostRequest = {
      ...current,
      status: "processing",
      attemptCount: current.attemptCount + 1,
      processingStartedAt: new Date(now).toISOString(),
      workerId: workerId.trim().slice(0, 100) || "agent",
      completedAt: undefined,
      failedAt: undefined,
      lastError: undefined
    };
    await writeJsonAtomically(requestPath(current.id), next);
    return next;
  });
}

export async function claimNextRequest(workerId = "agent") {
  const requests = await listPostRequests();

  for (const candidate of requests) {
    try {
      const claimed = await claimPostRequest(candidate.id, workerId);
      if (claimed) return claimed;
    } catch (error) {
      if (error instanceof RequestQueueError && error.code === "CONFLICT") continue;
      throw error;
    }
  }

  return null;
}

export async function markRequestCompleted(id: string) {
  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    if (current.status === "completed") return current;

    const completed: PostRequest = {
      ...current,
      status: "completed",
      completedAt: new Date().toISOString(),
      processingStartedAt: undefined,
      failedAt: undefined,
      lastError: undefined,
      workerId: undefined
    };
    await writeJsonAtomically(requestPath(id), completed);
    return completed;
  });
}

export async function markRequestFailed(id: string, message: string) {
  const errorMessage = message.trim().slice(0, 2000);
  if (!errorMessage) throw new Error("실패 원인을 입력해 주세요.");

  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    if (current.status === "completed") {
      throw new RequestQueueError("완료된 요청은 실패 처리할 수 없습니다.", "INVALID_STATE");
    }

    const failed: PostRequest = {
      ...current,
      status: "failed",
      failedAt: new Date().toISOString(),
      lastError: errorMessage,
      processingStartedAt: undefined,
      workerId: undefined
    };
    await writeJsonAtomically(requestPath(id), failed);
    return failed;
  });
}

export async function retryPostRequest(id: string) {
  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    if (current.status !== "failed") {
      throw new RequestQueueError("실패한 요청만 재시도할 수 있습니다.", "INVALID_STATE");
    }

    const pending: PostRequest = {
      ...current,
      status: "pending",
      attemptCount: 0,
      processingStartedAt: undefined,
      completedAt: undefined,
      failedAt: undefined,
      lastError: undefined,
      workerId: undefined
    };
    await writeJsonAtomically(requestPath(id), pending);
    return pending;
  });
}

export async function deletePostRequest(id: string) {
  return withRequestLock(id, async () => {
    await readRequestFile(id);
    await fs.unlink(requestPath(id));
    // 후보군 파일도 함께 삭제
    const candidatesPath = path.join(REQUEST_DIR, `${id}_candidates.json`);
    await fs.unlink(candidatesPath).catch(() => undefined);
  });
}

export async function markRequestAwaitingReview(id: string) {
  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    if (current.status === "completed") {
      throw new RequestQueueError("완료된 요청은 검수 대기 상태로 변경할 수 없습니다.", "INVALID_STATE");
    }

    const awaiting: PostRequest = {
      ...current,
      status: "awaiting_review",
      processingStartedAt: undefined,
      workerId: undefined
    };
    await writeJsonAtomically(requestPath(id), awaiting);
    return awaiting;
  });
}

export async function approvePostRequest(id: string) {
  return withRequestLock(id, async () => {
    const current = await readRequestFile(id);
    if (current.status !== "awaiting_review") {
      throw new RequestQueueError("검수 대기 중인 요청만 승인할 수 있습니다.", "INVALID_STATE");
    }

    const approved: PostRequest = {
      ...current,
      status: "approved",
      hasReviewed: true,
      attemptCount: 0,
      processingStartedAt: undefined,
      workerId: undefined
    };
    await writeJsonAtomically(requestPath(id), approved);
    return approved;
  });
}

