export type CreateBloggerPostInput = {
  accessToken: string;
  blogId: string;
  title: string;
  content: string;
  labels: string[];
  isDraft: boolean;
};

export type BloggerPostResult = {
  id?: string | null;
  title?: string | null;
  url?: string | null;
  status?: string | null;
  warnings?: string[];
};

type BloggerPostResponse = {
  id?: string | null;
  title?: string | null;
  url?: string | null;
  status?: string | null;
};

const MAX_LABELS = 5;
const MAX_LABEL_CHARACTERS = 180;

export class BloggerApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly responseBody: string
  ) {
    super(`Blogger post request failed (${status}). ${responseBody}`);
    this.name = "BloggerApiError";
  }
}

function removeInvalidUnicode(value: string) {
  let normalized = "";

  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);

    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff) {
        normalized += value[index] + value[index + 1];
        index += 1;
      }
      continue;
    }

    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) continue;
    if (codeUnit <= 0x08 || codeUnit === 0x0b || codeUnit === 0x0c || (codeUnit >= 0x0e && codeUnit <= 0x1f)) {
      continue;
    }

    normalized += value[index];
  }

  return normalized;
}

function normalizeBloggerLabels(labels: string[]) {
  const uniqueLabels: string[] = [];
  const seen = new Set<string>();
  let totalCharacters = 0;

  for (const rawLabel of labels) {
    const label = removeInvalidUnicode(rawLabel).replace(/[\r\n\t]+/g, " ").trim();
    const key = label.toLocaleLowerCase("ko-KR");
    if (!label || seen.has(key) || uniqueLabels.length >= MAX_LABELS) continue;

    const separatorLength = uniqueLabels.length > 0 ? 1 : 0;
    if (totalCharacters + separatorLength + label.length > MAX_LABEL_CHARACTERS) continue;

    seen.add(key);
    uniqueLabels.push(label);
    totalCharacters += separatorLength + label.length;
  }

  return uniqueLabels;
}

export async function createPost(input: CreateBloggerPostInput): Promise<BloggerPostResult> {
  const title = removeInvalidUnicode(input.title).trim();
  const content = removeInvalidUnicode(input.content);
  const labels = normalizeBloggerLabels(input.labels);
  const warnings: string[] = [];

  if (labels.length < input.labels.length) {
    warnings.push(`Blogger 안정성을 위해 라벨 ${input.labels.length}개를 ${labels.length}개로 정리했습니다.`);
  }

  const url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${encodeURIComponent(input.blogId)}/posts`);
  url.searchParams.set("isDraft", String(input.isDraft));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      kind: "blogger#post",
      title,
      content,
      labels
    }),
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[blogger/posts] Blogger API error", {
      status: response.status,
      body: text
    });
    throw new BloggerApiError(response.status, text);
  }

  const post = (await response.json()) as BloggerPostResponse;

  return {
    id: post.id,
    title: post.title,
    url: post.url,
    status: post.status,
    warnings
  };
}
