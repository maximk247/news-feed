export type ReactionType = 'like' | 'dislike';

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  liked?: boolean;
  disliked?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export type PostToggleReactionPayload = {
  postId: number;
  type: ReactionType;
};
