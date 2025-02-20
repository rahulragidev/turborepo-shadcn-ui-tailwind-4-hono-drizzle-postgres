import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db, users } from '@workspace/database'

const app = new Hono()

// Get port from command line argument or use default
const port = parseInt(process.argv[2]?.split('=')[1] || '3000', 10)

// Root route
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Get all users
app.get('/users', async (c) => {
  try {
    const allUsers = await db.select().from(users)
    return c.json(allUsers)
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// Create a new user
app.post('/users', async (c) => {
  try {
    const data = await c.req.json()
    const inserted = await db.insert(users).values(data).returning()
    return c.json(inserted[0], 201)
  } catch (error: unknown) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://${info.address}:${info.port}`)
})
