import Masonry from 'react-masonry-css';
import { useState, useEffect, useCallback } from "react";
import { FeedItem } from "@/components/atomic/molecules/feed-item";
import { Button, Spinner } from "@heroui/react";
import { feedApi } from "@/lib/api/feed";
import { CreateFeed } from "@/components/atomic/organisms/create-feed";

export const FeedList = () => {
    const [feeds, setFeeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

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

            setHasMore(response.hasMore);
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

    // 좋아요 토글 후 목록 상태 반영
    const handleLikeToggled = useCallback((feedNo: number, liked: boolean) => {
        setFeeds(prev => prev.map(f => f.feedNo === feedNo
            ? { ...f, isLiked: liked, likeCount: (f.likeCount ?? 0) + (liked ? 1 : -1) }
            : f
        ));
    }, []);

    // 피드 생성 핸들러
    const handleFeedCreated = useCallback((newFeed: any) => {
        setFeeds(prev => [newFeed, ...prev]);
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
        <div className="min-h-screen flex flex-col">
            {/* 피드 생성 모달 */}
            <div className="mt-4 mb-16 mx-auto">
                <CreateFeed onCreatedFeed={handleFeedCreated} />
            </div>

            {/* 피드 목록 */}
            <div className='flex flex-col items-center gap-8'>
                {feeds.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">아직 작성된 피드가 없습니다.</p>
                        <p className="text-gray-400 text-sm mt-2">첫 번째 피드를 작성해보세요!</p>
                    </div>
                ) : (feeds.map((feed) => (
                    <FeedItem
                        key={feed.feedNo}
                        id={feed.feedNo}
                        author={{
                            name: feed.user.userName,
                            avatar: feed.user.userAvatarUrl || '/user.png',
                            userNo: feed.user.userNo
                        }}
                        content={feed.feedContent}
                        image={feed.feedImageUrl}
                        likes={feed.likeCount ?? 0}
                        isLiked={feed.isLiked ?? false}
                        comments={0}
                        createdAt={formatDate(feed.createdAt)}
                        onDelete={handleDeleteFeed}
                        onLikeToggled={handleLikeToggled}
                    />
                ))
                )}
            </div>

            {/* 더보기 버튼 */}
            {hasMore && feeds.length > 0 && (
                <div className="mt-8 self-center">
                    <Button
                        variant="bordered"
                        size="lg"
                        onClick={handleLoadMore}
                        isLoading={loading && page > 1}
                        isDisabled={loading}
                    >
                        {loading && page > 1 ? '로딩 중...' : '더 보기'}
                    </Button>
                </div>
            )}
        </div>
    );
}