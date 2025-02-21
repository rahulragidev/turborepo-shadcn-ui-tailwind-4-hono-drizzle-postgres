"use client";

import { useState } from "react";
import type { User } from "@workspace/database/types";
import { Button } from "@workspace/ui/components/button";
import { ClientUserSchema } from "@workspace/database/zod-schema";
import { useZodForm } from "@workspace/ui/hooks/useZodForm";
import { useUsers } from "@workspace/ui/hooks/use-users";

export default function UsersPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { users, isLoading, error, createUser, updateUser, deleteUser } =
    useUsers();

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

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={editingUser ? handleSubmit(onSubmit) : handleSubmit(onSubmit)}
        className="mb-8 flex gap-4"
      >
        <input
          type="text"
          placeholder="Enter user name"
          className="px-4 py-2 border rounded-md"
          required
          {...register("name")}
        />
        {errors.name && (
          <span className="text-red-500">{String(errors.name.message)}</span>
        )}
        <Button type="submit">
          {editingUser ? "Update User" : "Add User"}
        </Button>
        {editingUser && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingUser(null);
              reset();
            }}
          >
            Cancel
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className="text-center">Loading users...</div>
      ) : (
        <div className="grid gap-4">
          {users?.map((user: User) => (
            <div
              key={user.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingUser(user);
                  }}
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
          ))}
        </div>
      )}
    </div>
  );
}
