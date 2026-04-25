import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.deleted') {
    const { id: clerkUserId } = evt.data

    if (clerkUserId) {
      // Delete profile and all related data (cascade will handle photos, links, etc.)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('clerk_user_id', clerkUserId)

      if (error) {
        console.error('Error deleting profile:', error)
        return new Response('Error deleting profile', { status: 500 })
      }

      console.log(`Deleted profile for Clerk user: ${clerkUserId}`)
    }
  }

  if (eventType === 'user.created') {
    // Optional: Create a profile stub when user is created
    // This is handled by onboarding flow, but you could do it here too
    console.log(`User created: ${evt.data.id}`)
  }

  return new Response('Webhook processed', { status: 200 })
}
