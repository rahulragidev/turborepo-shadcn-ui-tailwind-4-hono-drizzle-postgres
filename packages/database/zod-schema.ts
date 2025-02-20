import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { posts, users } from "./schema.js";

export const UserSchema = createSelectSchema(users);
export const NewUserSchema = createInsertSchema(users);

export const PostSchema = createSelectSchema(posts);
export const NewPostSchema = createInsertSchema(posts);
