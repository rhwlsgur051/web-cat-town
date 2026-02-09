import { WhiteBox } from "@/components/atomic/atoms/white-box"

export const FeedTopic = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center py-6 pr-4">
            <WhiteBox title="핫토픽 🔥">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div>🔥 고양이가 사료를 안먹어요.</div>
                        <div className="text-gray-500">127</div>
                    </div>
                    <div className="flex justify-between">
                        <div>🔥 집 앞에 길냥이가 있어요.</div>
                        <div className="text-gray-500">70</div>
                    </div>
                    <div className="flex justify-between">
                        <div>🔥 저희 애가 잘 안놀아요.</div>
                        <div className="text-gray-500">55</div>
                    </div>
                </div>
            </WhiteBox>
        </div>
    )
}