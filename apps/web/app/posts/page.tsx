"use client";

import { useState, useEffect } from "react";
import { Post, User } from "@workspace/database/types";
import { api } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  async function loadPosts() {
    try {
      setIsLoading(true);
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUsers() {
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }
    try {
      await api.createPost({
        title,
        content,
        userId: selectedUserId,
      });
      setTitle("");
      setContent("");
      setSelectedUserId(undefined);
      await loadPosts();
      setError(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    }
  }

  async function handleUpdatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPost || !selectedUserId) return;
    
    try {
      await api.updatePost(editingPost.id, {
        title,
        content,
        userId: selectedUserId,
      });
      setTitle("");
      setContent("");
      setSelectedUserId(undefined);
      setEditingPost(null);
      await loadPosts();
      setError(null);
    } catch (err) {
      setError("Failed to update post");
      console.error(err);
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await api.deletePost(postId);
      await loadPosts();
      setError(null);
    } catch (err) {
      setError("Failed to delete post");
      console.error(err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form 
        onSubmit={editingPost ? handleUpdatePost : handleCreatePost} 
        className="mb-8 space-y-4"
      >
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
            className="w-full px-4 py-2 border rounded-md"
            required
            rows={4}
          />
        </div>
        <div>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">
          {editingPost ? "Update Post" : "Add Post"}
        </Button>
        {editingPost && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingPost(null);
              setTitle("");
              setContent("");
              setSelectedUserId(undefined);
            }}
          >
            Cancel
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className="text-center">Loading posts...</div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 border rounded-md"
            >
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
                    onClick={() => {
                      setEditingPost(post);
                      setTitle(post.title);
                      setContent(post.content);
                      setSelectedUserId(post.userId);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
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
