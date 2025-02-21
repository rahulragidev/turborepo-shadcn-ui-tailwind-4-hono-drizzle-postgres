import useSWR, { useSWRConfig } from "swr";
import { api } from "@workspace/api-client";
import type { Post } from "@workspace/database/types";
import type { z } from "zod";
import type { ClientPostSchema } from "@workspace/database/zod-schema";
import { useStore } from "@workspace/store";

const POSTS_KEY = "posts";

interface UsePostsOptions {
  onSuccess?: (data: Post[]) => void;
}

export function usePosts(options: UsePostsOptions = {}) {
  const setPosts = useStore((state) => state.setPosts);

  const {
    data = [],
    error,
    isLoading,
  } = useSWR<Post[]>(POSTS_KEY, () => api.getPosts(), {
    onSuccess: (data) => {
      setPosts(data);
      options.onSuccess?.(data);
    },
  });

  const { mutate } = useSWRConfig();

  const createPost = async (postData: z.infer<typeof ClientPostSchema>) => {
    try {
      const newPost = await api.createPost(postData);
      await mutate(POSTS_KEY);
      return newPost;
    } catch (err) {
      console.error("Create post error:", err);
      throw new Error("Failed to create post");
    }
  };

  const updatePost = async (
    id: number,
    postData: z.infer<typeof ClientPostSchema>,
  ) => {
    try {
      const updatedPost = await api.updatePost(id, postData);
      await mutate(POSTS_KEY);
      return updatedPost;
    } catch (err) {
      console.error("Update post error:", err);
      throw new Error("Failed to update post");
    }
  };

  const deletePost = async (id: number) => {
    try {
      await api.deletePost(id);
      await mutate(POSTS_KEY);
    } catch (err) {
      console.error("Delete post error:", err);
      throw new Error("Failed to delete post");
    }
  };

  return {
    posts: data,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
  };
}
