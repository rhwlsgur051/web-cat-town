'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Textarea } from '@heroui/react';
import { sendMessageToGemini } from '@/lib/api/gemini';

type Message = { role: 'user' | 'assistant'; content: string };

export function HealthChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const { message } = await sendMessageToGemini(text);
      setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '답변을 불러오지 못했어요.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${errMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto">
      <div className="flex-1 space-y-4 p-4">
        {messages.length === 0 && (
          <p className="text-neutral-500 text-center py-8">
            고양이 건강·상태에 대해 궁금한 걸 입력해 보세요.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-default-200 text-foreground'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-default-200 rounded-2xl px-4 py-3">
              <span className="text-sm text-neutral-500">답변 생성 중...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-default-200 flex gap-2 items-end">
        <Textarea
          placeholder="고양이 건강 질문을 입력하세요"
          value={input}
          onValueChange={setInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          minRows={1}
          maxRows={4}
          classNames={{ input: 'min-h-[2.5rem]' }}
          disabled={loading}
        />
        <Button
          color="primary"
          onPress={handleSend}
          isLoading={loading}
          isDisabled={!input.trim()}
          className="shrink-0 min-w-[4rem]"
        >
          전송
        </Button>
      </div>
    </div>
  );
}
