import { HealthChat } from '@/components/atomic/organisms/health-chat';

export default function HealthPageRoute() {
  return (
    <div className="container py-4 mx-auto">
      <h1 className="font-luckiest text-2xl text-center mb-2">고양이 건강 상담</h1>
      <p className="text-neutral-500 text-center text-sm mb-4">
        궁금한 증상이나 상태를 물어보세요. (참고용이며, 진단은 수의사에게 받으세요.)
      </p>
      <HealthChat />
    </div>
  );
}
