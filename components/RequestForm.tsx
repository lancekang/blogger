"use client";

type RequestFormProps = {
  requestKeyword: string;
  setRequestKeyword: (kw: string) => void;
  isRequesting: boolean;
  handleRequestPost: () => void;
  needReview: boolean;
  setNeedReview: (val: boolean) => void;
  compareCount: number;
  setCompareCount: (val: number) => void;
};

export default function RequestForm({
  requestKeyword,
  setRequestKeyword,
  isRequesting,
  handleRequestPost,
  needReview,
  setNeedReview,
  compareCount,
  setCompareCount
}: RequestFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3">
        <label htmlFor="request-keyword" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          ⚡ 에이전트에게 새 포스팅 요청하기
        </label>
        <div className="flex gap-3">
          <input
            id="request-keyword"
            value={requestKeyword}
            onChange={(event) => setRequestKeyword(event.target.value)}
            placeholder="작성하고 싶은 주제나 키워드를 입력하세요. (예: 2026년 가성비 데님 추천)"
            disabled={isRequesting}
            className="h-11 flex-1 rounded-xl border border-slate-200 px-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:focus:ring-indigo-950"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRequestPost();
            }}
          />
          <button
            type="button"
            onClick={handleRequestPost}
            disabled={isRequesting || !requestKeyword.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRequesting ? "요청 중..." : "글 작성 요청"}
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-1 px-1">
          <div className="flex items-center gap-2">
            <input
              id="need-review-checkbox"
              type="checkbox"
              checked={needReview}
              onChange={(e) => setNeedReview(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 cursor-pointer"
            />
            <label htmlFor="need-review-checkbox" className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none cursor-pointer">
              🔍 비교 후보군(스펙/가격)을 에이전트 생성 전에 먼저 직접 검수하고 편집하겠습니다.
            </label>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
            <label htmlFor="compare-count-select" className="text-xs font-medium text-slate-500 dark:text-slate-400">
              기본 비교 제품 수:
            </label>
            <select
              id="compare-count-select"
              value={compareCount}
              onChange={(e) => setCompareCount(Number(e.target.value))}
              className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}개
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
