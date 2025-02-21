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
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to fetch posts");
    }
  },

  async createPost(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to create post");
    }
  },

  async updatePost(
    id: number,
    data: Partial<Omit<Post, "id" | "createdAt">>,
  ): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update post");
    }
  },

  async deletePost(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete post");
    }
  },

  // Add these new user operations
  async updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to update user");
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Failed to delete user");
    }
  },
};

export type Api = typeof api;
