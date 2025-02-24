// packages/db/types.ts
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, posts } from "./schema.js";
import { ClientPostSchema, ClientUserSchema } from "./zod-schema.js";
import { z } from "zod";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type ClientPostInput = z.infer<typeof ClientPostSchema>;
export type ClientUserInput = z.infer<typeof ClientUserSchema>;
