const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface GeminiChatResponse {
  message: string;
}

export const sendMessageToGemini = async (
  message: string
): Promise<GeminiChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/gemini/send-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || '답변 생성에 실패했습니다.');
  }
  return response.json();
};
