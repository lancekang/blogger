import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { BloggerApiError, createPost } from "@/lib/blogger";

type CreatePostRequest = {
  blogId?: unknown;
  title?: unknown;
  content?: unknown;
  labels?: unknown;
  isDraft?: unknown;
};

function normalizeLabels(labels: unknown): string[] {
  if (!Array.isArray(labels)) {
    return [];
  }

  return labels
    .filter((label): label is string => typeof label === "string")
    .map((label) => label.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Login is required." }, { status: 401 });
  }

  let body: CreatePostRequest;

  try {
    body = (await request.json()) as CreatePostRequest;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const blogId = typeof body.blogId === "string" ? body.blogId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const labels = normalizeLabels(body.labels);
  const isDraft = body.isDraft === true;

  if (!blogId) {
    return NextResponse.json({ error: "Please select a blog." }, { status: 400 });
  }

  if (!title) {
    return NextResponse.json({ error: "Please enter a title." }, { status: 400 });
  }

  if (!content.trim()) {
    return NextResponse.json({ error: "Please enter HTML content." }, { status: 400 });
  }

  try {
    const post = await createPost({
      accessToken: session.accessToken,
      blogId,
      title,
      content,
      labels,
      isDraft
    });

    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof BloggerApiError) {
      return NextResponse.json(
        {
          error:
            error.status === 400
              ? "Blogger가 글의 일부 값을 허용하지 않았습니다. 제목, 본문 HTML 또는 라벨을 확인해 주세요."
              : `Blogger API 요청에 실패했습니다. (${error.status})`,
          details: error.responseBody
        },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
