import { useQuery } from '@tanstack/react-query';

import { newsFeedService } from './news-feed.service';

export const NEWS_FEED_QUERY_KEY = {
  aiComment: (title: string, body: string) => ['ai-comment', title, body] as const,
};

export function useAICommentQuery(title: string, body: string, enabled = true) {
  return useQuery({
    queryKey: NEWS_FEED_QUERY_KEY.aiComment(title, body),
    queryFn: () => newsFeedService.generateAIComment(title, body),
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
