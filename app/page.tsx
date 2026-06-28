"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Header from "@/components/Header";
import QuotaBanner from "@/components/QuotaBanner";
import BlogSelector from "@/components/BlogSelector";
import TrendKeywords from "@/components/TrendKeywords";
import RequestForm from "@/components/RequestForm";
import RequestQueue from "@/components/RequestQueue";
import PendingPostsList from "@/components/PendingPostsList";
import PreviewViewer from "@/components/PreviewViewer";
import CandidateEditor from "@/components/CandidateEditor";

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
  
  // 후보군 검수 및 승인 상태
  const [needReview, setNeedReview] = useState(false);
  const [compareCount, setCompareCount] = useState(3);
  const [reviewingRequestId, setReviewingRequestId] = useState<string | null>(null);
  
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
        body: JSON.stringify({ keyword: trimmed, needReview, compareCount })
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
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-200 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        
        <Header session={session} status={status} signOut={signOut} />

        <QuotaBanner quotaResetTime={quotaResetTime} timeLeftText={timeLeftText} />

        {status === "loading" ? (
          <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm dark:border-slate-850 dark:bg-slate-900">
            <p className="text-sm text-slate-500 animate-pulse dark:text-slate-400">로그인 상태를 확인하는 중입니다...</p>
          </section>
        ) : null}

        {status === "unauthenticated" ? (
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="max-w-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Google 계정 연동 필요</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Blogger에 글을 발행하기 위해 Google 계정으로 로그인해 주세요.</p>
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
            <BlogSelector
              selectedBlogId={selectedBlogId}
              setSelectedBlogId={setSelectedBlogId}
              blogs={blogs}
              isLoadingBlogs={isLoadingBlogs}
              selectedBlog={selectedBlog}
              publishMode={publishMode}
              setPublishMode={setPublishMode}
            />

            <TrendKeywords
              trends={trends}
              activeTrendTab={activeTrendTab}
              setActiveTrendTab={setActiveTrendTab}
              isRefreshingTrends={isRefreshingTrends}
              loadTrends={loadTrends}
              setRequestKeyword={setRequestKeyword}
            />

            <RequestForm
              requestKeyword={requestKeyword}
              setRequestKeyword={setRequestKeyword}
              isRequesting={isRequesting}
              handleRequestPost={handleRequestPost}
              needReview={needReview}
              setNeedReview={setNeedReview}
              compareCount={compareCount}
              setCompareCount={setCompareCount}
            />

            <RequestQueue
              pendingRequests={pendingRequests}
              retryPendingRequest={retryPendingRequest}
              deletePendingRequest={deletePendingRequest}
              onReviewRequest={(id) => setReviewingRequestId(id)}
            />

            <PendingPostsList
              pendingPosts={pendingPosts}
              activePost={activePost}
              setActivePost={setActivePost}
              refreshAllData={refreshAllData}
            />

            <PreviewViewer
              activePost={activePost}
              isSubmitting={isSubmitting}
              selectedBlogId={selectedBlogId}
              message={message}
              deletePendingPost={deletePendingPost}
              submitPost={submitPost}
            />
          </div>
        ) : null}
      </div>

      {reviewingRequestId && (
        <CandidateEditor
          requestId={reviewingRequestId}
          onClose={() => setReviewingRequestId(null)}
          onApproved={() => {
            setMessage({
              kind: "success",
              text: "후보군이 승인되었습니다! 최종 포스트 생성이 시작됩니다."
            });
            refreshAllData();
          }}
        />
      )}
    </main>
  );
}
