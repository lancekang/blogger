"use client";

type RequestFormProps = {
  requestKeyword: string;
  setRequestKeyword: (kw: string) => void;
  isRequesting: boolean;
  handleRequestPost: () => void;
};

export default function RequestForm({
  requestKeyword,
  setRequestKeyword,
  isRequesting,
  handleRequestPost
}: RequestFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <label htmlFor="request-keyword" className="text-xs font-bold uppercase tracking-wider text-slate-500">
          ⚡ 에이전트에게 새 포스팅 요청하기
        </label>
        <div className="flex gap-3">
          <input
            id="request-keyword"
            value={requestKeyword}
            onChange={(event) => setRequestKeyword(event.target.value)}
            placeholder="작성하고 싶은 주제나 키워드를 입력하세요. (예: 2026년 가성비 데님 추천)"
            disabled={isRequesting}
            className="h-11 flex-1 rounded-xl border border-slate-200 px-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
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
      </div>
    </section>
  );
}
