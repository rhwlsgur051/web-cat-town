'use client'

import { useState, useEffect, useCallback } from "react";
import { PostCard } from "@/components/atomic/molecules/post-card";
import { Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { feedApi } from "@/lib/api/feed";
import { CreateFeed } from "@/components/atomic/organisms/create-feed";
import { FeedList } from "@/components/client-components/pages/feeds/feed-list";
import { FeedTopic } from "@/components/client-components/pages/feeds/feed-topic";

export default function Home() {
  const router = useRouter();

  const [feeds, setFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  // 피드 목록 조회
  const fetchFeeds = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await feedApi.getFeeds(pageNum, limit);

      if (pageNum === 1) {
        setFeeds(response.feeds);
      } else {
        setFeeds(prev => [...prev, ...response.feeds]);
      }

      setTotal(response.total);
      setHasMore(response.feeds.length === limit);
    } catch (error) {
      console.error('피드 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchFeeds(1);
  }, []);

  // 더보기 (useCallback으로 메모이제이션)
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeeds(nextPage);
  }, [page]);

  // 피드 삭제 핸들러 (useCallback으로 메모이제이션)
  const handleDeleteFeed = useCallback((feedNo: number) => {
    setFeeds(prev => prev.filter(feed => feed.feedNo !== feedNo));
  }, []);

  // 시간 포맷팅 (useCallback으로 메모이제이션하여 PostCard 리렌더링 방지)
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
  }, []);

  if (loading && page === 1) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <FeedList />
      </div>
      <div className="col-span-1">
        <FeedTopic />
      </div>
    </div>
  );
}
