import { NextResponse } from "next/server";
import { claimNextRequest, claimPostRequest, RequestQueueError } from "@/lib/request-queue";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      workerId?: unknown;
      requestId?: unknown;
    };
    const workerId = typeof body.workerId === "string" ? body.workerId : "agent";
    const requestId = body.requestId === undefined ? null : body.requestId;
    if (requestId !== null && typeof requestId !== "string") {
      return NextResponse.json({ error: "올바른 requestId가 필요합니다." }, { status: 400 });
    }

    const claimed = requestId
      ? await claimPostRequest(requestId, workerId)
      : await claimNextRequest(workerId);
    return NextResponse.json({ request: claimed });
  } catch (error) {
    if (error instanceof RequestQueueError) {
      const status = error.code === "CONFLICT" ? 409 : error.code === "NOT_FOUND" ? 404 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error("Failed to claim a post request:", error);
    return NextResponse.json({ error: "대기 요청을 선점하지 못했습니다." }, { status: 500 });
  }
}
