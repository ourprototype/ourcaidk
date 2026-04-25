'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type {
  Profile,
  ProfileUpdate,
  ProfilePhoto,
  ProfileLink,
  ProfileSocialLink,
  FullProfile,
  ProfileType,
  LayoutBlock,
  PrivacySettings,
} from '@/lib/types/database'

// Create Supabase client for server actions (uses service role key)
function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Default values
const defaultLayout: LayoutBlock[] = [
  { id: 'photos', type: 'photos', order: 0 },
  { id: 'name', type: 'name', order: 1 },
  { id: 'contact', type: 'contact', order: 2 },
  { id: 'social', type: 'social', order: 3 },
  { id: 'links', type: 'links', order: 4 },
]

const defaultPrivacy: PrivacySettings = {
  showName: true,
  showTitle: true,
  showBio: true,
  showCity: true,
  showPhone: true,
  showEmail: true,
  showOurEmail: true,
  showLinks: true,
  showSocial: true,
}

// Get current user's profile
export async function getMyProfile(): Promise<FullProfile | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  // Get profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error || !profile) return null

  // Get photos
  const { data: photos } = await supabase
    .from('profile_photos')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  // Get links
  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  // Get social links
  const { data: socialLinks } = await supabase
    .from('profile_social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  return {
    profile: profile as Profile,
    photos: (photos || []) as ProfilePhoto[],
    links: (links || []) as ProfileLink[],
    socialLinks: (socialLinks || []) as ProfileSocialLink[],
  }
}

// Check if current user has a profile
export async function hasProfile(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  return !!data
}

// Create a new profile
export async function createProfile(
  profileType: ProfileType,
  initialData?: Partial<ProfileUpdate>
): Promise<Profile | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      clerk_user_id: userId,
      profile_type: profileType,
      layout: defaultLayout,
      privacy: defaultPrivacy,
      ...initialData,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    return null
  }

  return data as Profile
}

// Update profile
export async function updateProfile(updates: ProfileUpdate): Promise<Profile | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('clerk_user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data as Profile
}

// Add a photo
export async function addPhoto(url: string, isMain: boolean = false): Promise<ProfilePhoto | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  // Get profile ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return null

  // Get current max order
  const { data: photos } = await supabase
    .from('profile_photos')
    .select('display_order')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = photos && photos.length > 0 ? photos[0].display_order + 1 : 0

  const { data, error } = await supabase
    .from('profile_photos')
    .insert({
      profile_id: profile.id,
      url,
      is_main: isMain,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding photo:', error)
    return null
  }

  return data as ProfilePhoto
}

// Remove a photo
export async function removePhoto(photoId: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  const { error } = await supabase
    .from('profile_photos')
    .delete()
    .eq('id', photoId)

  return !error
}

// Set main photo
export async function setMainPhoto(photoId: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  // Get profile ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return false

  // Unset all main photos
  await supabase
    .from('profile_photos')
    .update({ is_main: false })
    .eq('profile_id', profile.id)

  // Set new main photo
  const { error } = await supabase
    .from('profile_photos')
    .update({ is_main: true })
    .eq('id', photoId)

  return !error
}

// Add a custom link
export async function addLink(
  url: string,
  label?: string,
  displayType: 'text' | 'thumbnail' = 'text'
): Promise<ProfileLink | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  // Get profile ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return null

  // Get current max order
  const { data: links } = await supabase
    .from('profile_links')
    .select('display_order')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = links && links.length > 0 ? links[0].display_order + 1 : 0

  const { data, error } = await supabase
    .from('profile_links')
    .insert({
      profile_id: profile.id,
      url,
      label,
      display_type: displayType,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding link:', error)
    return null
  }

  return data as ProfileLink
}

// Update a link
export async function updateLink(
  linkId: string,
  updates: { label?: string; url?: string; display_type?: 'text' | 'thumbnail'; thumbnail_url?: string }
): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  const { error } = await supabase
    .from('profile_links')
    .update(updates)
    .eq('id', linkId)

  return !error
}

// Remove a link
export async function removeLink(linkId: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  const { error } = await supabase
    .from('profile_links')
    .delete()
    .eq('id', linkId)

  return !error
}

// Add a social link
export async function addSocialLink(platform: string, url: string): Promise<ProfileSocialLink | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = getSupabase()

  // Get profile ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!profile) return null

  // Get current max order
  const { data: links } = await supabase
    .from('profile_social_links')
    .select('display_order')
    .eq('profile_id', profile.id)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = links && links.length > 0 ? links[0].display_order + 1 : 0

  const { data, error } = await supabase
    .from('profile_social_links')
    .insert({
      profile_id: profile.id,
      platform,
      url,
      display_order: nextOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding social link:', error)
    return null
  }

  return data as ProfileSocialLink
}

// Update a social link
export async function updateSocialLink(
  linkId: string,
  updates: { platform?: string; url?: string }
): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  const { error } = await supabase
    .from('profile_social_links')
    .update(updates)
    .eq('id', linkId)

  return !error
}

// Remove a social link
export async function removeSocialLink(linkId: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = getSupabase()

  const { error } = await supabase
    .from('profile_social_links')
    .delete()
    .eq('id', linkId)

  return !error
}

// Get profile by ID (for public viewing)
export async function getProfileById(profileId: string): Promise<FullProfile | null> {
  const supabase = getSupabase()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (!profile) return null

  const { data: photos } = await supabase
    .from('profile_photos')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  const { data: links } = await supabase
    .from('profile_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  const { data: socialLinks } = await supabase
    .from('profile_social_links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('display_order')

  return {
    profile: profile as Profile,
    photos: (photos || []) as ProfilePhoto[],
    links: (links || []) as ProfileLink[],
    socialLinks: (socialLinks || []) as ProfileSocialLink[],
  }
}

// Search profiles
export async function searchProfiles(query: string, filters?: {
  type?: ProfileType
  city?: string
  province?: string
  verified?: boolean
}): Promise<Profile[]> {
  const supabase = getSupabase()

  let queryBuilder = supabase
    .from('profiles')
    .select('*')

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,business_name.ilike.%${query}%,title.ilike.%${query}%`)
  }

  if (filters?.type) {
    queryBuilder = queryBuilder.eq('profile_type', filters.type)
  }

  if (filters?.city) {
    queryBuilder = queryBuilder.ilike('city', `%${filters.city}%`)
  }

  if (filters?.province) {
    queryBuilder = queryBuilder.eq('province', filters.province)
  }

  if (filters?.verified) {
    queryBuilder = queryBuilder.eq('is_verified', true)
  }

  const { data, error } = await queryBuilder.limit(50)

  if (error) {
    console.error('Error searching profiles:', error)
    return []
  }

  return (data || []) as Profile[]
}
