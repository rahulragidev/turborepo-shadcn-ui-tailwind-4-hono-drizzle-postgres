import { User, Post } from "@workspace/database/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const api = {
  // User operations
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch users");
    }
  },

  async createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create user");
    }
  },

  // Post operations
  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  },

  async createPost(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create post");
    return response.json();
  },
};

export type Api = typeof api;
