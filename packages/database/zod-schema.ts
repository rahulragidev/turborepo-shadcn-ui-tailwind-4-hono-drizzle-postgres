import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { posts, users } from "@workspace/database/schema";
import { z } from "zod";

export const UserSchema = createSelectSchema(users);
export const NewUserSchema = createInsertSchema(users);

export const PostSchema = createSelectSchema(posts);
export const NewPostSchema = createInsertSchema(posts);

export const ClientUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const ClientPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  userId: z.number().positive("Please select a user"),
});
