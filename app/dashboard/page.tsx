'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { getMyProfile, updateProfile } from '@/lib/actions/profile'
import type { FullProfile } from '@/lib/types/database'

// Supported social platforms
const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
  { id: 'x', name: 'X', icon: 'x' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'snapchat', name: 'Snapchat', icon: 'snapchat' },
  { id: 'threads', name: 'Threads', icon: 'threads' },
  { id: 'pinterest', name: 'Pinterest', icon: 'pinterest' },
  { id: 'github', name: 'GitHub', icon: 'github' },
  { id: 'behance', name: 'Behance', icon: 'behance' },
  { id: 'website', name: 'Website', icon: 'website' },
]

// Layout block types
type BlockType = 'photos' | 'name' | 'contact' | 'social' | 'links'

interface LayoutBlock {
  id: string
  type: BlockType
  order: number
}

interface Photo {
  id: string
  url: string
  isMain: boolean
  order: number
}

interface CustomLink {
  id: string
  label: string
  url: string
  displayType: 'text' | 'thumbnail'
  thumbnailUrl?: string
}

interface SocialLink {
  id: string
  platform: string
  url: string
}

interface ProfileData {
  name: string
  title: string
  bio: string
  city: string
  province: string
  phone: string
  email: string
  ourEmail: string
  photos: Photo[]
  customLinks: CustomLink[]
  socialLinks: SocialLink[]
  layout: LayoutBlock[]
  privacy: {
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
  isPremium: boolean
  isVerified: boolean
}

const defaultLayout: LayoutBlock[] = [
  { id: 'photos', type: 'photos', order: 0 },
  { id: 'name', type: 'name', order: 1 },
  { id: 'contact', type: 'contact', order: 2 },
  { id: 'social', type: 'social', order: 3 },
  { id: 'links', type: 'links', order: 4 },
]

const defaultProfile: ProfileData = {
  name: '',
  title: '',
  bio: '',
  city: '',
  province: '',
  phone: '',
  email: '',
  ourEmail: '',
  photos: [],
  customLinks: [],
  socialLinks: [],
  layout: defaultLayout,
  privacy: {
    showName: true,
    showTitle: true,
    showBio: true,
    showCity: true,
    showPhone: true,
    showEmail: true,
    showOurEmail: true,
    showLinks: true,
    showSocial: true,
  },
  isPremium: false,
  isVerified: false,
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      const data = await getMyProfile()

      if (!data) {
        // No profile exists, redirect to onboarding
        router.push('/onboarding')
        return
      }

      // Map Supabase data to local state format
      setProfile({
        name: data.profile.name || '',
        title: data.profile.title || '',
        bio: data.profile.bio || '',
        city: data.profile.city || '',
        province: data.profile.province || '',
        phone: data.profile.phone || '',
        email: data.profile.email || '',
        ourEmail: data.profile.our_email || '',
        photos: data.photos.map(p => ({
          id: p.id,
          url: p.url,
          isMain: p.is_main,
          order: p.display_order,
        })),
        customLinks: data.links.map(l => ({
          id: l.id,
          label: l.label || '',
          url: l.url,
          displayType: l.display_type,
          thumbnailUrl: l.thumbnail_url || undefined,
        })),
        socialLinks: data.socialLinks.map(s => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        })),
        layout: data.profile.layout || defaultLayout,
        privacy: data.profile.privacy || defaultProfile.privacy,
        isPremium: data.profile.is_premium,
        isVerified: data.profile.is_verified,
      })
      setIsLoaded(true)
    }

    loadProfile()
  }, [router])

  // Save profile to Supabase
  const saveProfile = useCallback(async () => {
    await updateProfile({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      city: profile.city,
      province: profile.province,
      phone: profile.phone,
      email: profile.email,
      our_email: profile.ourEmail,
      layout: profile.layout,
      privacy: profile.privacy,
      is_premium: profile.isPremium,
      is_verified: profile.isVerified,
    })
  }, [profile])

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        saveProfile()
      }, 1000) // Debounce 1 second
      return () => clearTimeout(timeout)
    }
  }, [profile, isLoaded, saveProfile])

  const handleLogout = () => {
    signOut({ redirectUrl: '/' })
  }

  // Photo management
  const addPhoto = () => {
    const maxPhotos = profile.isPremium ? 5 : 1
    if (profile.photos.length >= maxPhotos) {
      if (!profile.isPremium) setShowUpgradeModal(true)
      return
    }
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: `/placeholder-${profile.photos.length + 1}.jpg`,
      isMain: profile.photos.length === 0,
      order: profile.photos.length,
    }
    setProfile({ ...profile, photos: [...profile.photos, newPhoto] })
  }

  const removePhoto = (id: string) => {
    const newPhotos = profile.photos.filter(p => p.id !== id)
    // If we removed the main photo, make the first one main
    if (newPhotos.length > 0 && !newPhotos.some(p => p.isMain)) {
      newPhotos[0].isMain = true
    }
    setProfile({ ...profile, photos: newPhotos })
  }

  const setMainPhoto = (id: string) => {
    const newPhotos = profile.photos.map(p => ({
      ...p,
      isMain: p.id === id,
    }))
    setProfile({ ...profile, photos: newPhotos })
  }

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...profile.photos]
    const [moved] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, moved)
    newPhotos.forEach((p, i) => (p.order = i))
    setProfile({ ...profile, photos: newPhotos })
  }

  // Custom links management
  const addCustomLink = () => {
    if (!profile.isPremium) {
      setShowUpgradeModal(true)
      return
    }
    if (profile.customLinks.length >= 5) return
    const newLink: CustomLink = {
      id: Date.now().toString(),
      label: '',
      url: '',
      displayType: 'text',
    }
    setProfile({ ...profile, customLinks: [...profile.customLinks, newLink] })
  }

  const updateCustomLink = (id: string, updates: Partial<CustomLink>) => {
    const newLinks = profile.customLinks.map(l =>
      l.id === id ? { ...l, ...updates } : l
    )
    setProfile({ ...profile, customLinks: newLinks })
  }

  const removeCustomLink = (id: string) => {
    setProfile({ ...profile, customLinks: profile.customLinks.filter(l => l.id !== id) })
  }

  // Social links management
  const addSocialLink = () => {
    if (!profile.isPremium) {
      setShowUpgradeModal(true)
      return
    }
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'instagram',
      url: '',
    }
    setProfile({ ...profile, socialLinks: [...profile.socialLinks, newLink] })
  }

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    const newLinks = profile.socialLinks.map(l =>
      l.id === id ? { ...l, ...updates } : l
    )
    setProfile({ ...profile, socialLinks: newLinks })
  }

  const removeSocialLink = (id: string) => {
    setProfile({ ...profile, socialLinks: profile.socialLinks.filter(l => l.id !== id) })
  }

  // Layout drag and drop
  const handleDragStart = (blockId: string) => {
    if (!profile.isPremium) {
      setShowUpgradeModal(true)
      return
    }
    setDraggedBlock(blockId)
  }

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault()
    if (!profile.isPremium || !draggedBlock || draggedBlock === blockId) return
  }

  const handleDrop = (targetBlockId: string) => {
    if (!profile.isPremium || !draggedBlock || draggedBlock === targetBlockId) return

    const newLayout = [...profile.layout]
    const draggedIndex = newLayout.findIndex(b => b.id === draggedBlock)
    const targetIndex = newLayout.findIndex(b => b.id === targetBlockId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [moved] = newLayout.splice(draggedIndex, 1)
      newLayout.splice(targetIndex, 0, moved)
      newLayout.forEach((b, i) => (b.order = i))
      setProfile({ ...profile, layout: newLayout })
    }
    setDraggedBlock(null)
  }

  // Privacy validation - at least email OR phone must be visible
  const updatePrivacy = (key: keyof ProfileData['privacy'], value: boolean) => {
    const newPrivacy = { ...profile.privacy, [key]: value }

    // Ensure at least email or phone is visible
    if (!value && (key === 'showEmail' || key === 'showPhone' || key === 'showOurEmail')) {
      const emailVisible = key === 'showEmail' ? value : newPrivacy.showEmail
      const phoneVisible = key === 'showPhone' ? value : newPrivacy.showPhone
      const ourEmailVisible = key === 'showOurEmail' ? value : newPrivacy.showOurEmail

      if (!emailVisible && !phoneVisible && !ourEmailVisible) {
        alert('At least one contact method (email or phone) must be visible.')
        return
      }
    }

    setProfile({ ...profile, privacy: newPrivacy })
  }

  // Toggle premium for demo
  const togglePremium = () => {
    setProfile({ ...profile, isPremium: !profile.isPremium })
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#af2d17] text-xl">Loading...</div>
      </div>
    )
  }

  // Social Icon Component
  const SocialIcon = ({ platform, className = "w-5 h-5" }: { platform: string; className?: string }) => {
    const icons: Record<string, JSX.Element> = {
      instagram: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      linkedin: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      tiktok: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      ),
      x: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      facebook: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      youtube: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      snapchat: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
        </svg>
      ),
      threads: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.108-1.146 3.456-1.17 1.005-.02 1.935.092 2.797.331.002-.477-.025-.942-.082-1.388-.192-1.509-.822-2.139-2.021-2.021-1.263.124-1.862.884-1.995 1.707l-2.134-.302c.256-1.792 1.746-3.396 4.237-3.396.832 0 2.8.126 3.702 1.89.535 1.045.658 2.274.658 3.573v.195c1.334.785 2.318 1.855 2.852 3.135.768 1.837.681 4.692-1.597 6.924-1.94 1.902-4.298 2.775-7.642 2.798zm-.037-8.677c-1.125.024-1.96.322-2.42.725-.37.322-.548.705-.52 1.104.03.472.282.86.752 1.154.526.33 1.255.487 2.05.442 1.063-.057 1.878-.457 2.423-1.187.378-.503.627-1.174.744-2.007-.97-.216-1.994-.248-3.03-.231z"/>
        </svg>
      ),
      pinterest: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      ),
      github: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
      behance: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.84c.56 0 1.01-.13 1.36-.397.35-.27.52-.678.52-1.227 0-.31-.06-.564-.166-.77-.11-.2-.25-.36-.433-.47-.18-.117-.39-.197-.636-.24-.24-.047-.5-.067-.78-.067H3.11v3.18h3.435v-.01zm.185 5.43c.318 0 .617-.03.9-.09.282-.06.53-.16.753-.3.223-.14.4-.33.527-.57.13-.24.19-.55.19-.92 0-.75-.22-1.29-.66-1.61-.44-.32-1.01-.48-1.7-.48H3.11v3.97h3.62zm9.21-5.69v-.94h5.68v.94h-5.68zm4.79-2.67c-.72 0-1.33.17-1.84.507-.51.34-.77.93-.78 1.77h3.91c-.02-.62-.23-1.08-.62-1.4-.4-.31-.88-.48-1.44-.48h-.23zm.22 7.63c.4 0 .75-.06 1.06-.18.31-.12.58-.29.79-.5.21-.21.38-.47.5-.77.13-.3.21-.64.26-1.01h-5.57c.02.45.1.86.26 1.2.16.36.37.67.65.91.28.25.6.44.99.56.38.12.8.18 1.26.18h-.2zM22.06 10.7c0-.42-.06-.8-.18-1.14-.12-.34-.29-.64-.52-.89-.23-.25-.51-.44-.85-.57-.34-.13-.73-.2-1.16-.2-.88 0-1.58.27-2.08.8-.51.53-.81 1.28-.9 2.22h5.69v-.22zm-5.73 5.96c.23.11.47.21.72.29.25.08.52.12.79.12.58 0 1.05-.16 1.4-.48.35-.32.52-.77.52-1.35 0-.61-.17-1.08-.52-1.4-.35-.32-.82-.48-1.4-.48-.27 0-.54.04-.79.12-.25.08-.49.18-.72.29-.23.11-.44.24-.63.39-.19.15-.36.31-.51.48l-1.55-1.39c.27-.31.58-.58.93-.8.35-.22.73-.41 1.13-.55.4-.14.82-.25 1.25-.31.44-.06.87-.1 1.31-.1 1.16 0 2.08.28 2.75.84.67.56 1 1.37 1 2.42 0 .5-.08.96-.25 1.37-.16.41-.4.77-.7 1.07-.3.3-.66.54-1.09.71-.42.17-.9.26-1.42.26-.58 0-1.12-.09-1.62-.27-.5-.18-.95-.43-1.37-.76l1.47-1.47c.19.17.4.32.63.43z"/>
        </svg>
      ),
      website: (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
    }
    return icons[platform] || icons.website
  }

  // Render a layout block for editing
  const renderEditBlock = (block: LayoutBlock) => {
    const blockContent: Record<BlockType, JSX.Element> = {
      photos: (
        <div className="border-2 border-[#af2d17] rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#af2d17]">Photos</h3>
            <span className="text-sm text-gray-500">
              {profile.photos.length} / {profile.isPremium ? 5 : 1}
              {!profile.isPremium && ' (Upgrade for more)'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {profile.photos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`relative aspect-square border-2 rounded-lg ${
                  photo.isMain ? 'border-[#af2d17] ring-2 ring-[#af2d17]' : 'border-gray-300'
                } overflow-hidden group`}
                draggable
                onDragStart={() => {}}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => reorderPhotos(idx, 0)}
              >
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">{idx + 1}</span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setMainPhoto(photo.id)}
                    className="p-1 bg-white rounded text-xs"
                    title="Set as main"
                  >
                    ★
                  </button>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="p-1 bg-red-500 text-white rounded text-xs"
                  >
                    ✕
                  </button>
                </div>
                {photo.isMain && (
                  <div className="absolute top-1 left-1 bg-[#af2d17] text-white text-xs px-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}

            {profile.photos.length < (profile.isPremium ? 5 : 1) && (
              <button
                onClick={addPhoto}
                className="aspect-square border-2 border-dashed border-[#af2d17] rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-[#af2d17] text-2xl">+</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Drag to reorder. Click ★ to set main photo.
          </p>
        </div>
      ),

      name: (
        <div className="border-2 border-[#af2d17] rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#af2d17] mb-3">Name, Title & Bio</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g., Graphic Designer"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                placeholder="Tell people about yourself..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      ),

      contact: (
        <div className="border-2 border-[#af2d17] rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#af2d17] mb-3">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                value={profile.province}
                onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
              >
                <option value="">Select...</option>
                <option value="AB">Alberta</option>
                <option value="BC">British Columbia</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NL">Newfoundland and Labrador</option>
                <option value="NT">Northwest Territories</option>
                <option value="NS">Nova Scotia</option>
                <option value="NU">Nunavut</option>
                <option value="ON">Ontario</option>
                <option value="PE">Prince Edward Island</option>
                <option value="QC">Quebec</option>
                <option value="SK">Saskatchewan</option>
                <option value="YT">Yukon</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">@our.ca Email</label>
              <input
                type="text"
                value={profile.ourEmail}
                disabled
                className="w-full px-3 py-2 border-2 border-gray-200 rounded bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Claim your @our.ca email from your account settings</p>
            </div>
          </div>
        </div>
      ),

      links: (
        <div className="border-2 border-[#af2d17] rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-[#af2d17]">Additional Links / Files</h3>
            {!profile.isPremium && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Premium only</span>
            )}
          </div>

          {profile.isPremium ? (
            <>
              <div className="space-y-3">
                {profile.customLinks.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="grid md:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateCustomLink(link.id, { label: e.target.value })}
                        placeholder="Label (e.g., My Portfolio)"
                        className="px-3 py-2 border border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateCustomLink(link.id, { url: e.target.value })}
                        placeholder="URL"
                        className="px-3 py-2 border border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={link.displayType === 'text'}
                            onChange={() => updateCustomLink(link.id, { displayType: 'text' })}
                            className="text-[#af2d17]"
                          />
                          <span className="text-sm">Text link</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            checked={link.displayType === 'thumbnail'}
                            onChange={() => updateCustomLink(link.id, { displayType: 'thumbnail' })}
                            className="text-[#af2d17]"
                          />
                          <span className="text-sm">Thumbnail</span>
                        </label>
                      </div>
                      <button
                        onClick={() => removeCustomLink(link.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    {link.displayType === 'thumbnail' && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
                          Upload
                        </div>
                        <span className="text-xs text-gray-500">Upload thumbnail image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {profile.customLinks.length < 5 && (
                <button
                  onClick={addCustomLink}
                  className="mt-3 text-[#af2d17] font-medium hover:underline text-sm"
                >
                  + Add custom link
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 border-2 border-dashed border-[#af2d17] rounded-lg text-[#af2d17] hover:bg-[#af2d17]/5 transition-colors"
            >
              Upgrade to Premium to add custom links
            </button>
          )}
        </div>
      ),

      social: (
        <div className="border-2 border-[#af2d17] rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-[#af2d17]">Social Media</h3>
            {!profile.isPremium && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Premium only</span>
            )}
          </div>

          {profile.isPremium ? (
            <>
              <div className="space-y-3">
                {profile.socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      placeholder="Profile URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-[#af2d17] focus:outline-none"
                    />
                    <button
                      onClick={() => removeSocialLink(link.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addSocialLink}
                className="mt-3 text-[#af2d17] font-medium hover:underline text-sm"
              >
                + Add social link
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 border-2 border-dashed border-[#af2d17] rounded-lg text-[#af2d17] hover:bg-[#af2d17]/5 transition-colors"
            >
              Upgrade to Premium to add social links
            </button>
          )}
        </div>
      ),
    }

    return (
      <div
        key={block.id}
        draggable={profile.isPremium}
        onDragStart={() => handleDragStart(block.id)}
        onDragOver={(e) => handleDragOver(e, block.id)}
        onDrop={() => handleDrop(block.id)}
        className={`relative ${profile.isPremium ? 'cursor-move' : ''} ${
          draggedBlock === block.id ? 'opacity-50' : ''
        }`}
      >
        {profile.isPremium && (
          <div className="absolute -left-8 top-4 text-gray-400 cursor-move">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}
        {blockContent[block.type]}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <div className="flex items-center gap-3">
            <a
              href="/profile/me"
              className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-all text-sm"
            >
              View Public Profile
            </a>
            <a href="/" className="px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
              home
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all"
            >
              log out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#af2d17]">Edit Your Profile</h1>
            <p className="text-gray-600">Customize how others see you</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Premium Toggle (Demo) */}
            <button
              onClick={togglePremium}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                profile.isPremium
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {profile.isPremium ? '★ Premium' : 'Free Account'}
            </button>

            {/* Tab Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'edit' ? 'bg-white text-[#af2d17] shadow' : 'text-gray-600'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-white text-[#af2d17] shadow' : 'text-gray-600'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Premium Layout Info */}
        {profile.isPremium && activeTab === 'edit' && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <span className="font-bold">★ Premium Layout:</span> Drag sections to reorder your profile layout.
            </p>
          </div>
        )}

        {activeTab === 'edit' ? (
          <div className="space-y-4 pl-8">
            {/* Render blocks in order */}
            {profile.layout
              .sort((a, b) => a.order - b.order)
              .map((block) => renderEditBlock(block))}

            {/* Privacy Controls */}
            <div className="border-2 border-[#af2d17] rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-[#af2d17]">Privacy Controls</h3>
                {!profile.isPremium && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Premium only</span>
                )}
              </div>

              {profile.isPremium ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose what's visible on your public profile. At least one contact method must be visible.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { key: 'showName', label: 'Name', required: true },
                      { key: 'showTitle', label: 'Title/Role', required: false },
                      { key: 'showBio', label: 'Bio', required: false },
                      { key: 'showCity', label: 'City/Province', required: false },
                      { key: 'showPhone', label: 'Phone', required: false },
                      { key: 'showEmail', label: 'Email', required: false },
                      { key: 'showOurEmail', label: '@our.ca Email', required: false },
                      { key: 'showLinks', label: 'Custom Links', required: false },
                      { key: 'showSocial', label: 'Social Media', required: false },
                    ].map(({ key, label, required }) => (
                      <label key={key} className={`flex items-center justify-between p-2 bg-gray-50 rounded ${required ? 'opacity-75' : ''}`}>
                        <span className="text-gray-700">
                          {label}
                          {required && <span className="text-[#af2d17] ml-1">*</span>}
                        </span>
                        <input
                          type="checkbox"
                          checked={profile.privacy[key as keyof typeof profile.privacy]}
                          onChange={(e) => updatePrivacy(key as keyof typeof profile.privacy, e.target.checked)}
                          disabled={required}
                          className={`w-5 h-5 text-[#af2d17] rounded ${required ? 'cursor-not-allowed' : ''}`}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Required field</p>
                </>
              ) : (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-3 border-2 border-dashed border-[#af2d17] rounded-lg text-[#af2d17] hover:bg-[#af2d17]/5 transition-colors"
                >
                  Upgrade to Premium to control field visibility
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-yellow-100 border-b border-yellow-300 py-2 px-4 text-center text-yellow-800 text-sm font-medium">
              Preview Mode — This is how your public profile appears
            </div>

            <ProfilePreview profile={profile} SocialIcon={SocialIcon} />
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-[#af2d17] mb-2">Upgrade to Premium</h3>
            <p className="text-gray-600 mb-4">
              Unlock the full potential of your profile with Premium features:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#af2d17]">✓</span> Up to 5 photos
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#af2d17]">✓</span> Drag-and-drop layout customization
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#af2d17]">✓</span> 5 custom links with thumbnails
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#af2d17]">✓</span> Unlimited social media icons
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <span className="text-[#af2d17]">✓</span> Verified badge on your profile
              </li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setProfile({ ...profile, isPremium: true })
                  setShowUpgradeModal(false)
                }}
                className="flex-1 bg-[#af2d17] text-white py-3 rounded-lg font-bold hover:opacity-90"
              >
                Upgrade — $1.17/month
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Profile Preview Component
function ProfilePreview({
  profile,
  SocialIcon
}: {
  profile: ProfileData
  SocialIcon: (props: { platform: string; className?: string }) => JSX.Element
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const mainPhoto = profile.photos.find(p => p.isMain) || profile.photos[0]
  const sortedPhotos = [...profile.photos].sort((a, b) => {
    if (a.isMain) return -1
    if (b.isMain) return 1
    return a.order - b.order
  })

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % sortedPhotos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + sortedPhotos.length) % sortedPhotos.length)
  }

  // For free users, use fixed layout
  const layoutToUse = profile.isPremium
    ? profile.layout.sort((a, b) => a.order - b.order)
    : defaultLayout

  const renderBlock = (block: LayoutBlock) => {
    const blockContent: Record<BlockType, JSX.Element | null> = {
      photos: profile.photos.length > 0 ? (
        <div className="relative">
          {/* Photo Carousel */}
          <div className="relative aspect-square max-w-xs mx-auto lg:mx-0 bg-[#af2d17] rounded-lg overflow-hidden">
            {sortedPhotos.length > 0 ? (
              <>
                <div className="w-full h-full flex items-center justify-center text-white">
                  <span className="text-6xl font-bold">
                    {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : '?'}
                  </span>
                </div>

                {sortedPhotos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      ›
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {sortedPhotos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPhotoIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                No photo
              </div>
            )}
          </div>
        </div>
      ) : null,

      name: (
        <div>
          {profile.privacy.showName && profile.name && (
            <h1 className="text-3xl lg:text-4xl font-bold text-[#af2d17]">{profile.name}</h1>
          )}
          {profile.privacy.showTitle && profile.title && (
            <p className="text-lg text-gray-600 mt-1">{profile.title}</p>
          )}
          {profile.isPremium && (
            <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold rounded-full">
              ★ Verified
            </span>
          )}
          {profile.privacy.showBio && profile.bio && (
            <p className="text-gray-700 leading-relaxed mt-3">{profile.bio}</p>
          )}
        </div>
      ),

      contact: (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-[#af2d17] mb-3">Contact</h3>
          <div className="space-y-2">
            {profile.privacy.showPhone && profile.phone && (
              <p className="text-gray-700">
                📞 <a href={`tel:${profile.phone}`} className="text-[#af2d17] hover:underline">{profile.phone}</a>
              </p>
            )}
            {profile.privacy.showEmail && profile.email && (
              <p className="text-gray-700">
                ✉️ <a href={`mailto:${profile.email}`} className="text-[#af2d17] hover:underline">{profile.email}</a>
              </p>
            )}
            {profile.privacy.showCity && (profile.city || profile.province) && (
              <p className="text-gray-700">
                📍 {[profile.city, profile.province].filter(Boolean).join(', ')}
              </p>
            )}
            {profile.privacy.showOurEmail && profile.ourEmail && (
              <p className="text-gray-700">
                ✉️ <a href={`mailto:${profile.ourEmail}`} className="text-[#af2d17] hover:underline font-medium">{profile.ourEmail}</a>
              </p>
            )}
          </div>
        </div>
      ),

      links: profile.isPremium && profile.privacy.showLinks && profile.customLinks.length > 0 ? (
        <div>
          <h3 className="font-bold text-[#af2d17] mb-3">Links</h3>
          <div className="flex flex-wrap gap-3">
            {profile.customLinks.map((link) => (
              link.displayType === 'thumbnail' ? (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-24 group"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-1 overflow-hidden">
                    {link.thumbnailUrl ? (
                      <img src={link.thumbnailUrl} alt={link.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">🔗</div>
                    )}
                  </div>
                  <p className="text-xs text-center text-gray-700 group-hover:text-[#af2d17] truncate">{link.label}</p>
                </a>
              ) : (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#af2d17] hover:underline"
                >
                  {link.label || link.url}
                </a>
              )
            ))}
          </div>
        </div>
      ) : null,

      social: profile.isPremium && profile.privacy.showSocial && profile.socialLinks.length > 0 ? (
        <div>
          <h3 className="font-bold text-[#af2d17] mb-3">Connect</h3>
          <div className="flex flex-wrap gap-3">
            {profile.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#af2d17] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                title={SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.name}
              >
                <SocialIcon platform={link.platform} className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      ) : null,
    }

    return blockContent[block.type]
  }

  // Free users get fixed two-column layout
  if (!profile.isPremium) {
    return (
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Photos */}
          <div className="lg:w-2/5">
            {renderBlock({ id: 'photos', type: 'photos', order: 0 })}
          </div>

          {/* Right - Info */}
          <div className="lg:w-3/5 space-y-4">
            {renderBlock({ id: 'name', type: 'name', order: 1 })}
            {renderBlock({ id: 'contact', type: 'contact', order: 2 })}
          </div>
        </div>
      </div>
    )
  }

  // Premium users get custom layout
  return (
    <div className="p-6 space-y-6">
      {layoutToUse.map((block) => {
        const content = renderBlock(block)
        return content ? <div key={block.id}>{content}</div> : null
      })}
    </div>
  )
}
