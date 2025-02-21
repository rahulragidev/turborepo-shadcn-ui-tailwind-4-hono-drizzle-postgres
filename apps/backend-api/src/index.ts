import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { timing } from "hono/timing";
import { z } from "zod";
import { db } from "../../../packages/database/database.js";
import { posts, users } from "@workspace/database/schema";
import { NewPostSchema, NewUserSchema } from "@workspace/database/zod-schema";
import { eq } from "drizzle-orm";

const app = new Hono();

// Add middleware
app.use("*", logger());
app.use("*", timing());
app.use("*", prettyJSON());

// Add CORS middleware
app.use(
  "/*",
  cors({
    origin: "*", // For development, allow all origins
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Requested-With"],
  }),
);

// Get port from command line argument or use default
const port = 3030;

// Root route
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Get all users
app.get("/users", async (c) => {
  try {
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Create a new user
app.post("/users", async (c) => {
  try {
    const data = await c.req.json();
    const validated = NewUserSchema.parse(data);
    const inserted = await db.insert(users).values(validated).returning();
    return c.json(inserted[0], 201);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get all posts
app.get("/posts", async (c) => {
  try {
    const allPosts = await db.select().from(posts);
    return c.json(allPosts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// Create a new post
app.post("/posts", async (c) => {
  try {
    const data = await c.req.json();
    const validated = NewPostSchema.parse(data);
    const inserted = await db.insert(posts).values(validated).returning();
    return c.json(inserted[0], 201);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Update a user
app.put("/users/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const data = await c.req.json();
    const validated = NewUserSchema.partial().parse(data);
    const updated = await db
      .update(users)
      .set(validated)
      .where(eq(users.id, id))
      .returning();
    return c.json(updated[0]);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Delete a user
app.delete("/users/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    await db.delete(users).where(eq(users.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// Update a post
app.put("/posts/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    const data = await c.req.json();
    const validated = NewPostSchema.partial().parse(data);
    const updated = await db
      .update(posts)
      .set(validated)
      .where(eq(posts.id, id))
      .returning();
    return c.json(updated[0]);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to update post" }, 500);
  }
});

// Delete a post
app.delete("/posts/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    await db.delete(posts).where(eq(posts.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

// Update the connection test to use Drizzle
async function testDbConnection() {
  try {
    // Test query to verify connection
    await db.select().from(users).limit(1);
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Add sample user if no users exist
async function addSampleUserIfNeeded() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    await db.insert(users).values({
      name: "Sample User",
    });
    console.log("✅ Added sample user");
  }
}

// Update the server startup
const startServer = async () => {
  const isDbConnected = await testDbConnection();
  if (!isDbConnected) {
    process.exit(1);
  }

  await addSampleUserIfNeeded();

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Server is running on http://${info.address}:${info.port}`);
    },
  );
};

startServer();
