import useSWR, { useSWRConfig } from "swr";
import { api } from "@workspace/api-client";
import type { User } from "@workspace/database/types";

const USERS_KEY = "users";

export function useUsers() {
  const {
    data = [],
    error,
    isLoading,
  } = useSWR<User[]>(USERS_KEY, () => api.getUsers());

  const { mutate } = useSWRConfig();

  const createUser = async (userData: { name: string }) => {
    try {
      await api.createUser(userData);
      await mutate(USERS_KEY);
    } catch (err) {
      console.error("Create user error:", err);
      throw new Error("Failed to create user");
    }
  };

  const updateUser = async (id: number, userData: { name: string }) => {
    try {
      await api.updateUser(id, userData);
      await mutate(USERS_KEY);
    } catch (err) {
      console.error("Update user error:", err);
      throw new Error("Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.deleteUser(id);
      await mutate(USERS_KEY);
    } catch (err) {
      console.error("Delete user error:", err);
      throw new Error("Failed to delete user");
    }
  };

  return {
    users: data,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
}
