import { NextResponse } from "next/server";
import {
  createPostRequest,
  deletePostRequest,
  listPostRequests,
  markRequestFailed,
  RequestQueueError,
  retryPostRequest
} from "@/lib/request-queue";

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof RequestQueueError) {
    const status = error.code === "NOT_FOUND" ? 404 : error.code === "CONFLICT" ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ requests: await listPostRequests() });
  } catch (error) {
    return errorResponse(error, "대기 중인 요청 목록을 불러오지 못했습니다.");
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { keyword?: unknown };
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
    if (!keyword) {
      return NextResponse.json({ error: "요청할 키워드를 입력해 주세요." }, { status: 400 });
    }

    const created = await createPostRequest(keyword);
    return NextResponse.json({ success: true, id: created.id, request: created }, { status: 201 });
  } catch (error) {
    return errorResponse(error, "에이전트에게 요청을 전달하지 못했습니다.");
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: unknown;
      action?: unknown;
      error?: unknown;
    };
    const id = typeof body.id === "string" ? body.id : "";
    const action = typeof body.action === "string" ? body.action : "";

    if (action === "fail") {
      const message = typeof body.error === "string" ? body.error : "";
      const updated = await markRequestFailed(id, message);
      return NextResponse.json({ success: true, request: updated });
    }
    if (action === "retry") {
      const updated = await retryPostRequest(id);
      return NextResponse.json({ success: true, request: updated });
    }

    return NextResponse.json({ error: "지원하지 않는 상태 변경 작업입니다." }, { status: 400 });
  } catch (error) {
    return errorResponse(error, "요청 상태를 변경하지 못했습니다.");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    await deletePostRequest(searchParams.get("id") ?? "");
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error, "요청을 삭제하지 못했습니다.");
  }
}
