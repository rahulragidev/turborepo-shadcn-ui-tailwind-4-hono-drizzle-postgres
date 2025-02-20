// packages/db/types.ts
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users, posts } from './schema.js';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;