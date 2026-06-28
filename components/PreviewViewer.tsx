"use client";

type PendingPost = {
  id: string;
  title: string;
  content: string;
  labels: string[];
  rawImages: string[];
};

type ApiMessage = {
  kind: "success" | "error";
  text: string;
};

type PreviewViewerProps = {
  activePost: PendingPost | null;
  isSubmitting: boolean;
  selectedBlogId: string;
  message: ApiMessage | null;
  deletePendingPost: (id: string) => void;
  submitPost: (isDraft: boolean) => void;
};

export default function PreviewViewer({
  activePost,
  isSubmitting,
  selectedBlogId,
  message,
  deletePendingPost,
  submitPost
}: PreviewViewerProps) {
  if (!activePost) return null;

  return (
    <section className="flex flex-col gap-4">
      {/* 액션 제어 바 */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500">
          블로그에 이 디자인 레이아웃 그대로 포스팅됩니다.
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => deletePendingPost(activePost.id)}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 px-5 text-sm font-bold text-rose-700 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            대기 글 삭제
          </button>
          <button
            type="button"
            onClick={() => submitPost(true)}
            disabled={isSubmitting || !selectedBlogId}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            초안 저장
          </button>
          <button
            type="button"
            onClick={() => submitPost(false)}
            disabled={isSubmitting || !selectedBlogId}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "발행 중..." : "Blogger에 즉시 발행"}
          </button>
        </div>
      </div>

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3.5 text-sm ${
            message.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {/* 실제 매거진 미리보기 뷰어 */}
      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* 카테고리 태그 및 제목 */}
        <header className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activePost.labels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                #{label}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight sm:text-3xl">
            {activePost.title}
          </h1>
        </header>

        {/* HTML 본문 리얼 렌더링 */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: activePost.content }} 
        />
      </article>
    </section>
  );
}
