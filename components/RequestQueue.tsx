"use client";

type PendingRequest = {
  id: string;
  keyword: string;
  status: "pending" | "processing" | "completed" | "failed" | "awaiting_review" | "approved";
  requestedAt: string;
  processingStartedAt?: string;
  attemptCount: number;
  lastError?: string;
  needReview?: boolean;
  hasReviewed?: boolean;
};

type RequestQueueProps = {
  pendingRequests: PendingRequest[];
  retryPendingRequest: (id: string) => void;
  deletePendingRequest: (id: string) => void;
  onReviewRequest: (id: string) => void;
};

export default function RequestQueue({
  pendingRequests,
  retryPendingRequest,
  deletePendingRequest,
  onReviewRequest
}: RequestQueueProps) {
  const activeQueue = pendingRequests.filter((req) => req.status !== "completed");

  if (activeQueue.length === 0) return null;

  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm dark:border-indigo-950/30 dark:bg-indigo-950/5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">에이전트 작업 큐 (Queue)</h2>
        </div>
        <div className="flex flex-col gap-2">
          {activeQueue.map((req) => {
            const isProcessing = req.status === "processing";
            const isFailed = req.status === "failed";
            const isAwaitingReview = req.status === "awaiting_review";
            const isApproved = req.status === "approved";
            
            const statusText = isFailed
              ? "생성 실패"
              : isProcessing
                ? "글 생성 중..."
                : isAwaitingReview
                  ? "🔍 후보군 검수 대기"
                  : isApproved
                    ? "승인 완료 (대기)"
                    : "글 생성 대기 중...";

            const badgeClass = isFailed
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
              : isProcessing
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                : isAwaitingReview
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                  : isApproved
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400";

            return (
              <div key={req.id} className="flex flex-col gap-3 rounded-xl border border-indigo-50 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-bold text-slate-800 dark:text-white">🔑 {req.keyword}</span>
                  <span className="mt-0.5 text-[10px] text-slate-400">요청일시: {new Date(req.requestedAt).toLocaleString()}</span>
                  
                  {req.needReview && (
                    <span className="mt-0.5 inline-flex text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                      ⚙️ 수동 검수 설정됨
                    </span>
                  )}
                  
                  {isProcessing && req.processingStartedAt ? (
                    <span className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                      처리 시작: {new Date(req.processingStartedAt).toLocaleString()} · 시도 {req.attemptCount}회
                    </span>
                  ) : null}
                  {isFailed && req.lastError ? (
                    <span className="mt-1 break-words text-xs text-rose-600 dark:text-rose-400">{req.lastError}</span>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${badgeClass}`}>
                    {!isFailed && !isAwaitingReview && !isApproved ? (
                      <span className={`h-2 w-2 rounded-full ${isProcessing ? "animate-pulse bg-amber-500" : "animate-pulse bg-indigo-500"}`} />
                    ) : null}
                    {statusText}
                  </span>
                  
                  {isAwaitingReview && (
                    <button
                      type="button"
                      onClick={() => onReviewRequest(req.id)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-3 text-xs font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    >
                      🔎 검수 & 승인
                    </button>
                  )}

                  {isFailed ? (
                    <button
                      type="button"
                      onClick={() => retryPendingRequest(req.id)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      재시도
                    </button>
                  ) : null}
                  
                  <button
                    type="button"
                    onClick={() => deletePendingRequest(req.id)}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-slate-750 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
