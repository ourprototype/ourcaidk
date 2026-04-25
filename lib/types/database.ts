// Database types for Supabase tables

export type ProfileType = 'personal' | 'business'

export interface Profile {
  id: string
  clerk_user_id: string
  profile_type: ProfileType

  // Basic info
  name: string | null
  email: string | null
  phone: string | null
  our_email: string | null
  city: string | null
  province: string | null

  // Personal fields
  title: string | null
  bio: string | null

  // Business fields
  owner_name: string | null
  business_name: string | null
  category: string | null
  address: string | null
  website: string | null
  hours: string | null
  description: string | null

  // Status
  is_premium: boolean
  is_verified: boolean

  // Layout and privacy (stored as JSON)
  layout: LayoutBlock[]
  privacy: PrivacySettings

  // Timestamps
  created_at: string
  updated_at: string
}

export interface LayoutBlock {
  id: string
  type: 'photos' | 'name' | 'contact' | 'social' | 'links'
  order: number
}

export interface PrivacySettings {
  showName: boolean
  showTitle: boolean
  showBio: boolean
  showCity: boolean
  showPhone: boolean
  showEmail: boolean
  showOurEmail: boolean
  showLinks: boolean
  showSocial: boolean
}

export interface ProfilePhoto {
  id: string
  profile_id: string
  url: string
  is_main: boolean
  display_order: number
  created_at: string
}

export interface ProfileLink {
  id: string
  profile_id: string
  label: string | null
  url: string
  display_type: 'text' | 'thumbnail'
  thumbnail_url: string | null
  display_order: number
  created_at: string
}

export interface ProfileSocialLink {
  id: string
  profile_id: string
  platform: string
  url: string
  display_order: number
  created_at: string
}

export interface OurEmailClaim {
  id: string
  profile_id: string
  username: string
  forward_to: string
  is_active: boolean
  created_at: string
}

// Full profile with all relations
export interface FullProfile {
  profile: Profile
  photos: ProfilePhoto[]
  links: ProfileLink[]
  socialLinks: ProfileSocialLink[]
}

// Insert/Update types (without auto-generated fields)
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'clerk_user_id' | 'created_at' | 'updated_at'>>

export type PhotoInsert = Omit<ProfilePhoto, 'id' | 'created_at'>
export type LinkInsert = Omit<ProfileLink, 'id' | 'created_at'>
export type SocialLinkInsert = Omit<ProfileSocialLink, 'id' | 'created_at'>
