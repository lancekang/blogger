"use client";

type TrendItem = {
  category: string;
  keywords: string[];
};

type TrendsResponse = {
  tabletMobile: TrendItem;
  laptopPc: TrendItem;
  gamingUmpc: TrendItem;
  wearableTech: TrendItem;
};

type TrendKeywordsProps = {
  trends: TrendsResponse | null;
  activeTrendTab: keyof TrendsResponse;
  setActiveTrendTab: (tab: keyof TrendsResponse) => void;
  isRefreshingTrends: boolean;
  loadTrends: () => void;
  setRequestKeyword: (kw: string) => void;
};

export default function TrendKeywords({
  trends,
  activeTrendTab,
  setActiveTrendTab,
  isRefreshingTrends,
  loadTrends,
  setRequestKeyword
}: TrendKeywordsProps) {
  if (!trends) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">🔥 오늘 카테고리별 최신 트렌드 추천 키워드 ({new Date().getFullYear()})</h2>
            <button
              type="button"
              onClick={loadTrends}
              disabled={isRefreshingTrends}
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 transition shadow-xs"
              title="트렌드 키워드 새로고침"
            >
              <svg className={`h-3.5 w-3.5 ${isRefreshingTrends ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 21v-5h-.581m0 0a8.003 8.003 0 01-15.357-2" />
              </svg>
            </button>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">클릭 시 자동 완성</span>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          {(Object.keys(trends) as Array<keyof TrendsResponse>).map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTrendTab(tabKey)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTrendTab === tabKey
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {trends[tabKey].category}
            </button>
          ))}
        </div>

        {/* 키워드 목록 */}
        <div className="grid gap-2 sm:grid-cols-1">
          {trends[activeTrendTab].keywords.map((keyword, idx) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                setRequestKeyword(keyword);
                const inputEl = document.getElementById("request-keyword");
                if (inputEl) inputEl.focus();
              }}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-left text-xs font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-900"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white border border-slate-100 text-[10px] font-bold text-slate-400 group-hover:border-indigo-100 group-hover:text-indigo-500">
                {idx + 1}
              </span>
              <span className="flex-1 truncate">{keyword}</span>
              <span className="text-[10px] font-bold text-indigo-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                선택 ⚡
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
