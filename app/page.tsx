'use client'

import { PostCard } from "@/components/molecules/post-card";
import { Button } from "@heroui/react";

// 임시 데이터
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: "냥집사",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    content: "우리 고양이가 오늘 처음으로 츄르를 먹었어요! 🐱\n너무 귀여운 모습이라 사진 찍었습니다 ㅎㅎ",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop",
    likes: 42,
    comments: 8,
    createdAt: "2시간 전"
  },
  {
    id: 2,
    author: {
      name: "고양이사랑",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    content: "오늘도 창가에서 햇빛 쬐는 우리 냥이 ☀️\n평화롭고 행복해 보여요~",
    image: "https://images.unsplash.com/photo-1573865526739-10c1dd7013e8?w=600&h=400&fit=crop",
    likes: 128,
    comments: 15,
    createdAt: "5시간 전"
  },
  {
    id: 3,
    author: {
      name: "멍냥러버",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d"
    },
    content: "고양이 간식 추천 받아요!\n우리 애가 입이 짧아서 잘 안먹더라구요 ㅠㅠ",
    likes: 23,
    comments: 31,
    createdAt: "1일 전"
  },
  {
    id: 4,
    author: {
      name: "캣타운주민",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f"
    },
    content: "새로 산 고양이 터널이 대박이에요!\n신나게 놀다가 지쳐서 잠든 모습 💤",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&h=400&fit=crop",
    likes: 89,
    comments: 12,
    createdAt: "1일 전"
  },
  {
    id: 5,
    author: {
      name: "냥이집사",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f"
    },
    content: "고양이 병원 다녀왔어요.\n건강검진 결과 이상 없대요! 다행이다 😊",
    likes: 67,
    comments: 9,
    createdAt: "2일 전"
  },
  {
    id: 6,
    author: {
      name: "캣맘",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d"
    },
    content: "아기 고양이 입양했어요! 🎉\n이름은 뭐가 좋을까요? 추천 부탁드려요~",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=400&fit=crop",
    likes: 156,
    comments: 48,
    createdAt: "3일 전"
  }
];

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-4">
      {/* 헤더 영역 */}
      <div className="w-full max-w-[600px] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">피드</h1>
          <Button color="primary" size="sm">
            글쓰기
          </Button>
        </div>
        <p className="text-default-500 text-sm">
          집사들의 일상을 공유해보세요 🐱
        </p>
      </div>

      {/* 게시글 목록 */}
      <div className="w-full flex flex-col items-center gap-4">
        {MOCK_POSTS.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="mt-8">
        <Button variant="bordered" size="lg">
          더 보기
        </Button>
      </div>
    </div>
  );
}
