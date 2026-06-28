"use client";

type Blog = {
  id: string;
  name: string;
  url?: string | null;
};

type BlogSelectorProps = {
  selectedBlogId: string;
  setSelectedBlogId: (id: string) => void;
  blogs: Blog[];
  isLoadingBlogs: boolean;
  selectedBlog?: Blog;
  publishMode: "manual" | "draft" | "publish";
  setPublishMode: (mode: "manual" | "draft" | "publish") => void;
};

export default function BlogSelector({
  selectedBlogId,
  setSelectedBlogId,
  blogs,
  isLoadingBlogs,
  selectedBlog,
  publishMode,
  setPublishMode
}: BlogSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[260px_1fr] sm:items-end">
        <div>
          <label htmlFor="blog" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            블로그 선택
          </label>
          <select
            id="blog"
            value={selectedBlogId}
            onChange={(event) => setSelectedBlogId(event.target.value)}
            disabled={isLoadingBlogs || blogs.length === 0}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {blogs.length === 0 ? <option value="">블로그 없음</option> : null}
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 text-xs font-medium text-slate-500 border border-slate-100">
          {isLoadingBlogs ? "블로그 정보를 불러오는 중..." : selectedBlog?.url ?? "선택된 블로그 주소가 여기에 표시됩니다."}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">⚡ 에이전트 발행 모드 설정</span>
        <div className="mt-2.5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setPublishMode("manual")}
            className={`flex-1 min-w-[140px] rounded-xl border py-2.5 px-4 text-xs font-bold transition-all ${
              publishMode === "manual"
                ? "bg-slate-955 text-white border-slate-955 shadow-sm bg-slate-950"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            🔍 수동 검수 후 발행
          </button>
          <button
            type="button"
            onClick={() => setPublishMode("draft")}
            className={`flex-1 min-w-[140px] rounded-xl border py-2.5 px-4 text-xs font-bold transition-all ${
              publishMode === "draft"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            📂 Blogger 초안으로 자동 저장
          </button>
          <button
            type="button"
            onClick={() => setPublishMode("publish")}
            className={`flex-1 min-w-[140px] rounded-xl border py-2.5 px-4 text-xs font-bold transition-all ${
              publishMode === "publish"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            🚀 Blogger에 즉시 자동 발행
          </button>
        </div>
        <p className="mt-2.5 text-[11px] font-medium leading-relaxed text-slate-400">
          {publishMode === "manual" && "※ 에이전트가 글을 완료하면 대기 목록에 남고, 사용자가 직접 디자인을 확인하고 발행을 결정합니다."}
          {publishMode === "draft" && "※ 에이전트가 글 생성을 완료하는 즉시, 사용자 개입 없이 Blogger에 '임시저장 초안'으로 자동 업로드됩니다."}
          {publishMode === "publish" && "※ 에이전트가 글 생성을 완료하는 즉시, 사용자 개입 없이 Blogger에 '공개 포스트'로 자동 발행됩니다."}
        </p>
      </div>
    </section>
  );
}
