"use client";

import { useState } from "react";
import type { Post } from "@workspace/database/types";
import { Button } from "@workspace/ui/components/button";
import { ClientPostSchema } from "@workspace/database/zod-schema";
import { useZodForm } from "@workspace/ui/hooks/useZodForm";
import { usePosts } from "@workspace/ui/hooks/use-posts";
import { useUsers } from "@workspace/ui/hooks/use-users";

export default function PostsPage() {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { posts, isLoading, error, createPost, updatePost, deletePost } = usePosts();
  const { users } = useUsers();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useZodForm(ClientPostSchema);

  const onSubmit = async (data: { title: string; content: string; userId: number }) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, data);
        setEditingPost(null);
      } else {
        await createPost(data);
      }
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setValue("title", post.title);
    setValue("content", post.content);
    setValue("userId", post.userId);
  };

  const handleCancel = () => {
    setEditingPost(null);
    reset();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-8 space-y-4"
      >
        <div>
          <input
            type="text"
            placeholder="Enter post title"
            className="w-full px-4 py-2 border rounded-md"
            {...register("title")}
            required
          />
          {errors.title && (
            <span className="text-red-500">{String(errors.title.message)}</span>
          )}
        </div>
        <div>
          <textarea
            placeholder="Enter post content"
            className="w-full px-4 py-2 border rounded-md"
            {...register("content")}
            required
            rows={4}
          />
          {errors.content && (
            <span className="text-red-500">
              {String(errors.content.message)}
            </span>
          )}
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-md"
            {...register("userId", { valueAsNumber: true })}
            required
          >
            <option value="">Select a user</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.userId && (
            <span className="text-red-500">
              {String(errors.userId.message)}
            </span>
          )}
        </div>
        <Button type="submit">
          {editingPost ? "Update Post" : "Add Post"}
        </Button>
        {editingPost && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className="text-center">Loading posts...</div>
      ) : (
        <div className="grid gap-4">
          {posts?.map((post: Post) => (
            <div key={post.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="mt-2">{post.content}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
