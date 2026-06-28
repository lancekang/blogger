"use client";

import { useEffect, useState } from "react";

type Candidate = {
  name: string;
  spec: string;
  price: string;
  pros: string;
  cons: string;
};

type CandidateEditorProps = {
  requestId: string;
  onClose: () => void;
  onApproved: () => void;
};

export default function CandidateEditor({ requestId, onClose, onApproved }: CandidateEditorProps) {
  const [keyword, setKeyword] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCandidates() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/ai/request-post?id=${requestId}`);
        if (!response.ok) throw new Error("후보군 데이터를 불러오지 못했습니다.");
        const data = (await response.json()) as {
          request?: { keyword: string };
          candidates?: Candidate[] | null;
        };
        
        setKeyword(data.request?.keyword ?? "");
        setCandidates(data.candidates ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    if (requestId) {
      loadCandidates();
    }
  }, [requestId]);

  const handleChange = (index: number, field: keyof Candidate, value: string) => {
    const next = [...candidates];
    next[index] = { ...next[index], [field]: value };
    setCandidates(next);
  };

  const handleAdd = () => {
    setCandidates([
      ...candidates,
      { name: "", spec: "", price: "", pros: "", cons: "" }
    ]);
  };

  const handleDelete = (index: number) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleApprove = async () => {
    if (candidates.length === 0) {
      alert("최소 하나의 비교 후보 제품이 있어야 합니다.");
      return;
    }
    
    // 검증
    for (const c of candidates) {
      if (!c.name.trim()) {
        alert("모든 제품의 이름(제품명)을 입력해 주세요.");
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/request-post", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: requestId,
          action: "approve",
          candidates
        })
      });

      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error ?? "승인 처리에 실패했습니다.");

      onApproved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs dark:bg-slate-950/80">
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* 모달 헤더 */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">후보군 스펙 & 가격 검수</span>
            <h3 className="truncate text-base font-bold text-slate-800 dark:text-white">🔑 {keyword}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </header>

        {/* 모달 본문 (스크롤) */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-xs text-slate-400">후보군 정보 조회를 수행하고 있습니다...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                에이전트가 1차 수집한 아래 후보군 정보를 검수 및 편집해 주세요. 승인 시 이 표를 기반으로 본문 작성이 시작됩니다.
              </div>

              {candidates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                  <p className="text-xs text-slate-400">추출된 후보군이 없습니다. 직접 추가해 주세요.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {candidates.map((candidate, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(idx)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800"
                        >
                          삭제
                        </button>
                      </div>

                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-black text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        {idx + 1}
                      </span>

                      <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">제품명 / 모델명</label>
                          <input
                            type="text"
                            value={candidate.name}
                            onChange={(e) => handleChange(idx, "name", e.target.value)}
                            placeholder="예: 갤럭시 탭 S10 울트라"
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">실구매가 또는 범위</label>
                          <input
                            type="text"
                            value={candidate.price}
                            onChange={(e) => handleChange(idx, "price", e.target.value)}
                            placeholder="예: 1,400,000원 대 (오픈마켓 기준)"
                            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">핵심 스펙 및 특징 요약</label>
                          <textarea
                            value={candidate.spec}
                            onChange={(e) => handleChange(idx, "spec", e.target.value)}
                            placeholder="예: MediaTek Dimensity 9300+ AP, 14.6인치 Dynamic AMOLED 2X 화면..."
                            rows={2}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase text-emerald-600 dark:text-emerald-400">장점</label>
                          <textarea
                            value={candidate.pros}
                            onChange={(e) => handleChange(idx, "pros", e.target.value)}
                            placeholder="예: 대화면 디스플레이와 반사 방지 코팅 완성도가 뛰어남"
                            rows={2}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase text-rose-600 dark:text-rose-400">단점</label>
                          <textarea
                            value={candidate.cons}
                            onChange={(e) => handleChange(idx, "cons", e.target.value)}
                            placeholder="예: 본체 무게가 다소 무겁고 휴대가 까다로움"
                            rows={2}
                            className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
              >
                ＋ 비교 제품 추가하기
              </button>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isLoading || isSubmitting || candidates.length === 0}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "승인 처리 중..." : "원고 생성 승인 ⚡"}
          </button>
        </footer>

      </div>
    </div>
  );
}
