"use client";

import { useState } from "react";
import type { User } from "@workspace/database/types";
import { Button } from "@workspace/ui/components/button";
import { ClientUserSchema } from "@workspace/database/zod-schema";
import { useZodForm } from "@workspace/ui/hooks/useZodForm";
import { useUsers } from "@workspace/ui/hooks/use-users";
import { useStore, type StoreState } from "@workspace/store";

export default function UsersPage() {
  // 1. All useState hooks
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 2. All store hooks
  const users = useStore((state: StoreState) => state.users);
  const setUsers = useStore((state: StoreState) => state.setUsers);

  // 3. All data fetching hooks
  const { createUser, updateUser, deleteUser, isLoading } = useUsers({
    onSuccess: (data) => {
      setUsers(data);
    },
  });

  // 4. Form hooks
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useZodForm(ClientUserSchema);

  const onSubmit = async (data: { name: string }) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
        setEditingUser(null);
      } else {
        await createUser(data);
      }
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    reset({ name: user.name });
  };

  const handleCancel = () => {
    setEditingUser(null);
    reset();
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter user name"
            className="w-full px-4 py-2 border rounded-md"
            {...register("name")}
            required
          />
          {errors.name && (
            <span className="text-red-500">{String(errors.name.message)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            {editingUser ? "Update User" : "Add User"}
          </Button>
          {editingUser && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : users?.length === 0 ? (
          <div>No users found</div>
        ) : (
          users?.map((user) => (
            <div key={user.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{user.name}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
