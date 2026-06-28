import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

type BloggerBlogsResponse = {
  items?: Array<{
    id?: string | null;
    name?: string | null;
    url?: string | null;
  }>;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Login is required." }, { status: 401 });
  }

  try {
    const response = await fetch("https://www.googleapis.com/blogger/v3/users/self/blogs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[blogger/blogs] Blogger API error", {
        status: response.status,
        body: text
      });

      return NextResponse.json(
        {
          error: `Blogger blog list request failed (${response.status}). ${text}`
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as BloggerBlogsResponse;

    return NextResponse.json({
      items: data.items ?? []
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[blogger/blogs] Request failed:", message);

    return NextResponse.json(
      {
        error: `Blogger blog list request failed before receiving a response. ${message}`
      },
      { status: 502 }
    );
  }
}
