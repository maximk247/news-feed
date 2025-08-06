import { useMutation, useQuery } from '@tanstack/react-query';
import { groqService } from './groq.service';

export const GROQ_QUERY_KEY = {
  voices: ['voices'] as const,
  playAIComment: ['play-ai-comment'] as const,
};

export function useAIVoicesQuery() {
  return useQuery({
    queryKey: GROQ_QUERY_KEY.voices,
    queryFn: () => groqService.getVoices(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function usePlayAICommentMutation() {
  return useMutation({
    mutationKey: GROQ_QUERY_KEY.playAIComment,
    mutationFn: ({ text, voice }: { text: string; voice: string }) =>
      groqService.playText(text, voice),
  });
}
