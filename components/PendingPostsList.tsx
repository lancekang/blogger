"use client";

type PendingPost = {
  id: string;
  title: string;
  content: string;
  labels: string[];
  rawImages: string[];
};

type PendingPostsListProps = {
  pendingPosts: PendingPost[];
  activePost: PendingPost | null;
  setActivePost: (post: PendingPost | null) => void;
  refreshAllData: () => void;
};

export default function PendingPostsList({
  pendingPosts,
  activePost,
  setActivePost,
  refreshAllData
}: PendingPostsListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex h-2.5 w-2.5 rounded-full ${pendingPosts.length > 0 ? "bg-indigo-600 animate-pulse" : "bg-slate-300"}`} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">에이전트 대기 중인 글 ({pendingPosts.length})</h2>
          </div>
          <button 
            type="button"
            onClick={refreshAllData}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            수동 동기화
          </button>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-400">대기 중인 글이 없습니다.</p>
            <p className="mt-1 text-xs text-slate-400">위의 입력창을 통해 에이전트에게 첫 번째 글을 요청해 보세요!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pendingPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setActivePost(post)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition border ${
                  activePost?.id === post.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                📄 {post.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
