"use client";

import { useState, useEffect } from "react";
import { User } from "@workspace/database/types";
import { api } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { ClientUserSchema } from "@workspace/database/zod-schema";
import { useZodForm } from "@workspace/ui/hooks/useZodForm";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(ClientUserSchema);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: { name: string }) => {
    try {
      await api.createUser(data);
      setNewUserName("");
      await loadUsers();
      setError(null);
    } catch (err) {
      setError("Failed to create user");
      console.error(err);
    }
  };

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await api.updateUser(editingUser.id, { name: newUserName });
      setNewUserName("");
      setEditingUser(null);
      await loadUsers();
      setError(null);
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.deleteUser(userId);
      await loadUsers();
      setError(null);
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={editingUser ? handleUpdateUser : handleSubmit(onSubmit)}
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
              setNewUserName("");
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
          {users.map((user) => (
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
                    setNewUserName(user.name);
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
