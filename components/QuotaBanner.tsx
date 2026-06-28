"use client";

type QuotaBannerProps = {
  quotaResetTime: string | null;
  timeLeftText: string;
};

export default function QuotaBanner({ quotaResetTime, timeLeftText }: QuotaBannerProps) {
  if (!quotaResetTime || !timeLeftText) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 text-lg">
          ⚠️
        </span>
        <div>
          <h4 className="text-sm font-bold text-amber-900">이미지 생성 AI 할당량 초과</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            현재 AI 이미지 생성 모델의 실시간 호출 한도가 초과되어 텍스트 글 위주로 자동 생성됩니다.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center rounded-xl bg-white/60 border border-amber-200/50 px-3.5 py-1.5 text-right min-w-[140px]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">초기화 대기 시간</span>
        <span className="text-sm font-black text-amber-900 mt-0.5">{timeLeftText}</span>
      </div>
    </div>
  );
}
