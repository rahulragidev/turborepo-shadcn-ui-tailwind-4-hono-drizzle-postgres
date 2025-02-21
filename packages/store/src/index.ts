import { create } from 'zustand'
import type { User, Post } from '@workspace/database/types'

export interface StoreState {
  users: User[]
  posts: Post[]
  setUsers: (users: User[]) => void
  setPosts: (posts: Post[]) => void
  addUser: (user: User) => void
  addPost: (post: Post) => void
  updateUser: (id: number, userData: Partial<User>) => void
  updatePost: (id: number, postData: Partial<Post>) => void
  deleteUser: (id: number) => void
  deletePost: (id: number) => void
}

export const useStore = create<StoreState>((set) => ({
  users: [],
  posts: [],
  
  setUsers: (users) => set({ users }),
  setPosts: (posts) => set({ posts }),
  
  addUser: (user) => set((state) => ({ 
    users: [...state.users, user] 
  })),
  
  addPost: (post) => set((state) => ({ 
    posts: [...state.posts, post] 
  })),
  
  updateUser: (id, userData) => set((state) => ({
    users: state.users.map((user) => 
      user.id === id ? { ...user, ...userData } : user
    )
  })),
  
  updatePost: (id, postData) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === id ? { ...post, ...postData } : post
    )
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((user) => user.id !== id)
  })),
  
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== id)
  }))
})) 