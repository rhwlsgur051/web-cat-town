'use client'

import { Card, CardBody, CardFooter, Image, Button } from "@heroui/react";

// 고양이 용품 샘플 데이터
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "고급 캣타워",
    price: 89000,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
    description: "3단 구조의 튼튼한 캣타워"
  },
  {
    id: 2,
    name: "프리미엄 츄르 세트",
    price: 15000,
    image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop",
    description: "고양이가 좋아하는 다양한 맛"
  },
  {
    id: 3,
    name: "자동 급식기",
    price: 45000,
    image: "https://images.unsplash.com/photo-1591084728795-1149f32d9866?w=400&h=400&fit=crop",
    description: "타이머 설정 가능한 급식기"
  },
  {
    id: 4,
    name: "고양이 화장실",
    price: 35000,
    image: "https://images.unsplash.com/photo-1581888227599-779811939961?w=400&h=400&fit=crop",
    description: "냄새 차단 기능 포함"
  },
  {
    id: 5,
    name: "캣닢 장난감 세트",
    price: 12000,
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400&h=400&fit=crop",
    description: "다양한 종류의 장난감"
  },
  {
    id: 6,
    name: "고양이 터널",
    price: 18000,
    image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=400&fit=crop",
    description: "접이식 놀이 터널"
  },
  {
    id: 7,
    name: "고양이 침대",
    price: 28000,
    image: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=400&h=400&fit=crop",
    description: "푹신한 원형 침대"
  },
  {
    id: 8,
    name: "스크래처",
    price: 22000,
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop",
    description: "내구성이 좋은 스크래처"
  }
];

export default function Shopping() {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-4">
      {/* 헤더 영역 */}
      <div className="w-full max-w-[1000px] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">쇼핑</h1>
        </div>
        <p className="text-default-500 text-sm">
          우리 고양이를 위한 특별한 용품들 🛒
        </p>
      </div>

      {/* 상품 그리드 */}
      <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SAMPLE_PRODUCTS.map((product) => (
          <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
            {/* 상품 이미지 */}
            <CardBody className="p-0 overflow-hidden">
              <div className="relative w-full pb-[100%] bg-gray-100">
                <img
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src={product.image}
                />
              </div>
            </CardBody>

            {/* 상품 정보 */}
            <CardFooter className="flex flex-col items-start gap-2 p-3">
              <div className="w-full">
                <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-base font-bold text-amber-700">
                  {formatPrice(product.price)}원
                </span>
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat"
                  onClick={() => alert('준비중입니다!')}
                >
                  구매
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 준비중 안내 */}
      <div className="w-full max-w-[1000px] text-center py-8">
        <p className="text-gray-400 text-sm">
          * 실제 상품이 아닌 샘플 페이지입니다
        </p>
      </div>
    </div>
  );
}
