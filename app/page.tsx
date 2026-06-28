"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

type Blog = {
  id: string;
  name: string;
  url?: string | null;
};

type ApiMessage = {
  kind: "success" | "error";
  text: string;
};

type PendingPost = {
  id: string;
  title: string;
  content: string;
  labels: string[];
  rawImages: string[];
};

type PendingRequest = {
  id: string;
  keyword: string;
  requestedAt: string;
  status: "pending" | "processing" | "completed" | "failed";
  attemptCount: number;
  processingStartedAt?: string;
  completedAt?: string;
  failedAt?: string;
  lastError?: string;
  workerId?: string;
};

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

export default function Home() {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  
  // 현재 선택되어 렌더링 중인 임시 글 정보
  const [activePost, setActivePost] = useState<PendingPost | null>(null);
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([]);
  
  // 에이전트 키워드 요청 및 대기 큐 상태
  const [requestKeyword, setRequestKeyword] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  
  // 최신 트렌드 키워드 추천 상태
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [activeTrendTab, setActiveTrendTab] = useState<keyof TrendsResponse>("tabletMobile");
  const [isRefreshingTrends, setIsRefreshingTrends] = useState(false);

  const loadTrends = useCallback(async () => {
    setIsRefreshingTrends(true);
    try {
      const response = await fetch(`/api/ai/trend-keywords?t=${Date.now()}`);
      if (response.ok) {
        const data = (await response.json()) as TrendsResponse;
        setTrends(data);
      }
    } catch (err) {
      console.error("Failed to load trend keywords:", err);
    } finally {
      setIsRefreshingTrends(false);
    }
  }, []);

  // 이미지 쿼타 리셋 상태
  const [quotaResetTime, setQuotaResetTime] = useState<string | null>(null);
  const [timeLeftText, setTimeLeftText] = useState("");
  
  const [message, setMessage] = useState<ApiMessage | null>(null);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 에이전트 발행 모드 설정 ("manual" | "draft" | "publish")
  const [publishMode, setPublishMode] = useState<"manual" | "draft" | "publish">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blogger_publish_mode");
      return (saved as "manual" | "draft" | "publish") || "manual";
    }
    return "manual";
  });

  useEffect(() => {
    localStorage.setItem("blogger_publish_mode", publishMode);
  }, [publishMode]);

  const selectedBlog = useMemo(() => blogs.find((blog) => blog.id === selectedBlogId), [blogs, selectedBlogId]);

  // 블로그 목록 조회
  useEffect(() => {
    if (status !== "authenticated") {
      setBlogs([]);
      setSelectedBlogId("");
      return;
    }

    async function loadBlogs() {
      setIsLoadingBlogs(true);
      setMessage(null);

      try {
        const response = await fetch("/api/blogger/blogs");
        const data = (await response.json()) as { items?: Blog[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "블로그 목록을 불러오지 못했습니다.");
        }

        const nextBlogs = data.items ?? [];
        setBlogs(nextBlogs);
        setSelectedBlogId(nextBlogs[0]?.id ?? "");
      } catch (error) {
        setMessage({
          kind: "error",
          text: error instanceof Error ? error.message : "블로그 목록을 불러오지 못했습니다."
        });
      } finally {
        setIsLoadingBlogs(false);
      }
    }

    void loadBlogs();
  }, [status]);

  // 트렌드 키워드 패칭
  useEffect(() => {
    void loadTrends();
  }, [loadTrends]);

  // 이미지 쿼타 상태 로드 및 타이머 설정
  useEffect(() => {
    async function loadQuotaStatus() {
      try {
        const response = await fetch("/quota-status.json");
        if (response.ok) {
          const data = (await response.json()) as { imageQuotaResetTime?: string };
          if (data.imageQuotaResetTime) {
            setQuotaResetTime(data.imageQuotaResetTime);
          }
        }
      } catch (err) {
        console.error("Failed to load quota status:", err);
      }
    }
    void loadQuotaStatus();
  }, []);

  useEffect(() => {
    if (!quotaResetTime) return;

    const targetTime = new Date(quotaResetTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setQuotaResetTime(null);
        setTimeLeftText("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let text = "";
      if (hours > 0) text += `${hours}시간 `;
      if (minutes > 0 || hours > 0) text += `${minutes}분 `;
      text += `${seconds}초`;
      setTimeLeftText(text);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [quotaResetTime]);

  // 에이전트 대기 글 목록 조회
  const loadPendingPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/pending-posts");
      const data = (await response.json()) as { posts?: PendingPost[] };
      if (response.ok && data.posts) {
        setPendingPosts(data.posts);
        
        // 활성화된 글이 삭제되었다면 리스트 상태에 따라 갱신
        if (activePost) {
          const stillExists = data.posts.find((p) => p.id === activePost.id);
          if (!stillExists) {
            setActivePost(data.posts[0] ?? null);
          }
        } else if (data.posts.length > 0 && !activePost) {
          // 기본적으로 첫 번째 글을 불러와서 바로 보여줌
          setActivePost(data.posts[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load pending posts:", err);
    }
  }, [activePost]);

  // 에이전트 대기 중인 요청 큐 조회
  const loadPendingRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/ai/request-post");
      const data = (await response.json()) as { requests?: PendingRequest[] };
      if (response.ok && data.requests) {
        setPendingRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to load pending requests:", err);
    }
  }, []);

  // 전체 데이터 갱신 (수동 및 자동 폴링용)
  const refreshAllData = useCallback(() => {
    void loadPendingPosts();
    void loadPendingRequests();
  }, [loadPendingPosts, loadPendingRequests]);

  // 로그인 상태인 경우 5초마다 자동 폴링하여 백그라운드 상태 동기화
  useEffect(() => {
    if (status !== "authenticated") {
      setPendingPosts([]);
      setPendingRequests([]);
      setActivePost(null);
      return;
    }

    refreshAllData();

    const interval = setInterval(() => {
      refreshAllData();
    }, 5000);

    return () => clearInterval(interval);
  }, [status, refreshAllData]);

  // 자동 발행 처리 감지 및 수행
  useEffect(() => {
    if (status !== "authenticated" || publishMode === "manual" || pendingPosts.length === 0 || !selectedBlogId || isSubmitting) {
      return;
    }

    const targetPost = pendingPosts[0];
    const isDraft = publishMode === "draft";

    setIsSubmitting(true);
    
    void (async () => {
      try {
        const response = await fetch("/api/blogger/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            blogId: selectedBlogId,
            title: targetPost.title,
            content: targetPost.content,
            labels: targetPost.labels,
            isDraft
          })
        });

        const data = (await response.json()) as {
          post?: { title?: string | null };
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Blogger 등록 실패");
        }

        // 성공 시 pending-posts에서 삭제
        await fetch(`/api/ai/pending-posts?id=${targetPost.id}`, { method: "DELETE" });
        
        setMessage({
          kind: "success",
          text: `[자동 처리 완료] ${isDraft ? "초안 저장" : "즉시 발행"}: ${data.post?.title ?? targetPost.title}`
        });

        // 429 Rate Limit (Too Many Requests) 방지를 위해 4초 대기 (쿨다운)
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } catch (error) {
        console.error("Auto-publish error:", error);
        setMessage({
          kind: "error",
          text: `[자동 발행 실패] ${targetPost.title.substring(0, 15)}... - ${error instanceof Error ? error.message : "알 수 없는 오류"}`
        });
        // 에러 방지를 위해 수동 모드로 강제 복귀
        setPublishMode("manual");
      } finally {
        setIsSubmitting(false);
        refreshAllData();
      }
    })();
  }, [pendingPosts, publishMode, selectedBlogId, isSubmitting, status, refreshAllData]);

  // 에이전트에게 포스팅 생성 요청
  async function handleRequestPost() {
    const trimmed = requestKeyword.trim();
    if (!trimmed) return;

    setIsRequesting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/ai/request-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ keyword: trimmed })
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "요청을 보내지 못했습니다.");
      }

      setMessage({
        kind: "success",
        text: `에이전트에게 '${trimmed}' 주제로 포스팅 작성을 요청했습니다. 아래 작업 대기 큐에서 실시간 진행 상태를 확인하실 수 있습니다.`
      });
      setRequestKeyword("");
      // 즉시 갱신
      refreshAllData();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "요청 중 오류가 발생했습니다."
      });
    } finally {
      setIsRequesting(false);
    }
  }

  // Blogger에 글 등록 (초안 또는 즉시 발행)
  async function submitPost(isDraft: boolean) {
    if (!activePost) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/blogger/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          blogId: selectedBlogId,
          title: activePost.title,
          content: activePost.content,
          labels: activePost.labels,
          isDraft
        })
      });

      const data = (await response.json()) as {
        post?: {
          title?: string | null;
          url?: string | null;
          status?: string | null;
          warnings?: string[];
        };
        error?: string;
        details?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "글 저장에 실패했습니다.");
      }

      const statusText = isDraft ? "초안 저장" : "즉시 발행";
      const postTitle = data.post?.title ?? activePost.title;
      const postUrl = data.post?.url ? ` (${data.post.url})` : "";
      const warningText = data.post?.warnings?.length ? ` ${data.post.warnings.join(" ")}` : "";

      setMessage({
        kind: "success",
        text: `${statusText} 완료: ${postTitle}${postUrl}${warningText}`
      });

      // 등록 성공 시 로컬 임시 대기 글 및 이미지 파일 삭제
      const finishedId = activePost.id;
      try {
        await fetch(`/api/ai/pending-posts?id=${finishedId}`, { method: "DELETE" });
        // 목록 갱신
        refreshAllData();
      } catch (err) {
        console.error("Failed to delete pending post after submit:", err);
      }
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "글 저장에 실패했습니다."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // 에이전트 대기 글 삭제
  async function deletePendingPost(id: string) {
    if (!confirm("이 대기 글을 삭제하시겠습니까? 관련 이미지 파일도 함께 삭제됩니다.")) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/ai/pending-posts?id=${id}`, {
        method: "DELETE"
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "대기 글 삭제에 실패했습니다.");
      }

      setMessage({
        kind: "success",
        text: "대기 중인 글이 성공적으로 삭제되었습니다."
      });

      // 만약 활성화된 글을 지웠다면 해제
      if (activePost?.id === id) {
        setActivePost(null);
      }
      
      refreshAllData();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "대기 글 삭제 중 오류가 발생했습니다."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // 에이전트 대기 큐 요청 삭제
  async function deletePendingRequest(id: string) {
    if (!confirm("이 대기 요청을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/ai/request-post?id=${id}`, {
        method: "DELETE"
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "대기 요청 삭제에 실패했습니다.");
      }

      setMessage({
        kind: "success",
        text: "대기 중인 키워드 요청이 성공적으로 삭제되었습니다."
      });
      
      refreshAllData();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "대기 요청 삭제 중 오류가 발생했습니다."
      });
    }
  }

  async function retryPendingRequest(id: string) {
    try {
      const response = await fetch("/api/ai/request-post", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "retry" })
      });
      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error ?? "요청을 재시도하지 못했습니다.");

      setMessage({ kind: "success", text: "실패한 요청을 대기 큐에 다시 등록했습니다." });
      refreshAllData();
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : "요청 재시도 중 오류가 발생했습니다."
      });
    }
  }
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        
        {/* 헤더 영역 */}
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Blogger Agent Bridge</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Blogger 포스팅 관리자</h1>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">{session.user?.email}</span>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  로그아웃
                </button>
              </div>
            ) : null}
          </div>
        </header>

        {/* 이미지 생성 AI 쿼타 초과 배너 */}
        {quotaResetTime && timeLeftText ? (
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
        ) : null}

        {status === "loading" ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-slate-500 animate-pulse">로그인 상태를 확인하는 중입니다...</p>
          </section>
        ) : null}

        {status === "unauthenticated" ? (
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="max-w-sm">
              <h2 className="text-lg font-bold text-slate-900">Google 계정 연동 필요</h2>
              <p className="mt-2 text-sm text-slate-500">Blogger에 글을 발행하기 위해 Google 계정으로 로그인해 주세요.</p>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"
              >
                Google로 로그인
              </button>
            </div>
          </section>
        ) : null}

        {status === "authenticated" ? (
          <div className="flex flex-col gap-6">
            
            {/* 1. 블로그 선택 섹션 */}
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
                        ? "bg-slate-950 text-white border-slate-950 shadow-sm"
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

            {/* 2. 최신 트렌드 키워드 큐레이션 (신규) */}
            {trends ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">🔥 오늘 카테고리별 최신 트렌드 추천 키워드 (2026)</h2>
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
            ) : null}

            {/* 2. 에이전트 포스팅 생성 요청 섹션 */}
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
                      if (e.key === "Enter") void handleRequestPost();
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

            {/* 3. 에이전트 작업 큐 (상태 표시) */}
            {pendingRequests.some((req) => req.status !== "completed") ? (
              <section className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                    </span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900">에이전트 작업 큐 (Queue)</h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    {pendingRequests
                      .filter((req) => req.status !== "completed")
                      .map((req) => {
                        const isProcessing = req.status === "processing";
                        const isFailed = req.status === "failed";
                        const statusText = isFailed ? "생성 실패" : isProcessing ? "글 생성 중..." : "글 생성 대기 중...";
                        const badgeClass = isFailed
                          ? "bg-rose-50 text-rose-700"
                          : isProcessing
                            ? "bg-amber-50 text-amber-700"
                            : "bg-indigo-50 text-indigo-700";

                        return (
                          <div key={req.id} className="flex flex-col gap-3 rounded-xl border border-indigo-50 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-bold text-slate-800">🔑 {req.keyword}</span>
                              <span className="mt-0.5 text-[10px] text-slate-400">요청일시: {new Date(req.requestedAt).toLocaleString()}</span>
                              {isProcessing && req.processingStartedAt ? (
                                <span className="mt-0.5 text-[10px] text-amber-600">
                                  처리 시작: {new Date(req.processingStartedAt).toLocaleString()} · 시도 {req.attemptCount}회
                                </span>
                              ) : null}
                              {isFailed && req.lastError ? (
                                <span className="mt-1 break-words text-xs text-rose-600">{req.lastError}</span>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${badgeClass}`}>
                                {!isFailed ? (
                                  <span className={`h-2 w-2 rounded-full ${isProcessing ? "animate-pulse bg-amber-500" : "animate-pulse bg-indigo-500"}`} />
                                ) : null}
                                {statusText}
                              </span>
                              {isFailed ? (
                                <button
                                  type="button"
                                  onClick={() => retryPendingRequest(req.id)}
                                  className="inline-flex h-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
                                >
                                  재시도
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => deletePendingRequest(req.id)}
                                className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
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
            ) : null}

            {/* 4. 에이전트 완료 글 목록 섹션 */}
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

            {/* 5. 리얼 미리보기 뷰어 */}
            {activePost ? (
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
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
