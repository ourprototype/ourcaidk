'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// Supported social platforms
const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'x', name: 'X' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'snapchat', name: 'Snapchat' },
  { id: 'threads', name: 'Threads' },
  { id: 'pinterest', name: 'Pinterest' },
  { id: 'github', name: 'GitHub' },
  { id: 'behance', name: 'Behance' },
  { id: 'website', name: 'Website' },
]

// Layout block types
type BlockType = 'photos' | 'name' | 'bio' | 'contact' | 'links' | 'social'

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
  { id: 'bio', type: 'bio', order: 2 },
  { id: 'contact', type: 'contact', order: 3 },
  { id: 'links', type: 'links', order: 4 },
  { id: 'social', type: 'social', order: 5 },
]

// Social Icon Component
function SocialIcon({ platform, className = "w-5 h-5" }: { platform: string; className?: string }) {
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
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.84c.56 0 1.01-.13 1.36-.397.35-.27.52-.678.52-1.227 0-.31-.06-.564-.166-.77-.11-.2-.25-.36-.433-.47-.18-.117-.39-.197-.636-.24-.24-.047-.5-.067-.78-.067H3.11v3.18h3.435v-.01zm.185 5.43c.318 0 .617-.03.9-.09.282-.06.53-.16.753-.3.223-.14.4-.33.527-.57.13-.24.19-.55.19-.92 0-.75-.22-1.29-.66-1.61-.44-.32-1.01-.48-1.7-.48H3.11v3.97h3.62zm9.21-5.69v-.94h5.68v.94h-5.68z"/>
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

export default function ProfilePage() {
  const params = useParams()
  const profileId = params.id as string
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    // For "me" profile, load from localStorage
    if (profileId === 'me') {
      const savedData = localStorage.getItem('profileData')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setProfile({
            name: parsed.name || '',
            title: parsed.title || '',
            bio: parsed.bio || '',
            city: parsed.city || '',
            province: parsed.province || '',
            phone: parsed.phone || '',
            email: parsed.email || '',
            ourEmail: parsed.ourEmail || '',
            photos: parsed.photos || [],
            customLinks: parsed.customLinks || [],
            socialLinks: parsed.socialLinks || [],
            layout: parsed.layout || defaultLayout,
            privacy: {
              showName: parsed.privacy?.showName ?? true,
              showTitle: parsed.privacy?.showTitle ?? true,
              showBio: parsed.privacy?.showBio ?? true,
              showCity: parsed.privacy?.showCity ?? true,
              showPhone: parsed.privacy?.showPhone ?? true,
              showEmail: parsed.privacy?.showEmail ?? true,
              showOurEmail: parsed.privacy?.showOurEmail ?? true,
              showLinks: parsed.privacy?.showLinks ?? true,
              showSocial: parsed.privacy?.showSocial ?? true,
            },
            isPremium: parsed.isPremium || false,
            isVerified: parsed.isVerified || false,
          })
        } catch (e) {
          console.error('Failed to parse profile')
        }
      }
    } else {
      // For other profiles, we'd fetch from API
      // For demo, show a sample profile
      setProfile({
        name: 'Sample User',
        title: 'Designer & Developer',
        bio: 'This is a sample profile. In production, this would load from your database.',
        city: 'Toronto',
        province: 'ON',
        phone: '(416) 555-1234',
        email: 'sample@example.com',
        ourEmail: 'sample@our.ca',
        photos: [{ id: '1', url: '', isMain: true, order: 0 }],
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
      })
    }
    setIsLoading(false)
  }, [profileId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#af2d17] text-xl">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="bg-[#af2d17] text-white py-4">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a href="/" className="text-4xl font-bold">our.ca</a>
            <div className="flex items-center gap-3">
              <a href="/search" className="px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
                search
              </a>
              <a href="/" className="px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
                home
              </a>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-[#af2d17] mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist or has been removed.</p>
          <a href="/" className="inline-block bg-[#af2d17] text-white px-8 py-3 rounded font-bold hover:opacity-90">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

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

  // Render photo carousel
  const PhotoCarousel = () => (
    <div className="relative">
      <div className="relative aspect-square w-full max-w-sm mx-auto lg:mx-0 bg-[#af2d17] rounded-xl overflow-hidden shadow-lg">
        {sortedPhotos.length > 0 ? (
          <>
            {/* Photo display - using initials as placeholder */}
            <div className="w-full h-full flex items-center justify-center text-white">
              <span className="text-7xl md:text-8xl font-bold">
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : '?'}
              </span>
            </div>

            {/* Navigation arrows */}
            {sortedPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors flex items-center justify-center text-xl"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors flex items-center justify-center text-xl"
                  aria-label="Next photo"
                >
                  ›
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {sortedPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentPhotoIndex
                          ? 'bg-white scale-110'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Photo counter */}
            {sortedPhotos.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-full">
                {currentPhotoIndex + 1} / {sortedPhotos.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 text-lg">
            No photo
          </div>
        )}
      </div>
    </div>
  )

  // Render name section
  const NameSection = () => (
    <div>
      {profile.privacy.showName && profile.name && (
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#af2d17]">
          {profile.name}
        </h1>
      )}
      {profile.privacy.showTitle && profile.title && (
        <p className="text-lg md:text-xl text-gray-600 mt-1">{profile.title}</p>
      )}
      {profile.isPremium && (
        <span className="inline-flex items-center gap-1 mt-3 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold rounded-full shadow-md">
          <span>★</span> Verified
        </span>
      )}
    </div>
  )

  // Render bio section
  const BioSection = () => (
    profile.privacy.showBio && profile.bio ? (
      <div>
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">{profile.bio}</p>
      </div>
    ) : null
  )

  // Render contact section
  const ContactSection = () => (
    <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
      <h3 className="font-bold text-[#af2d17] mb-4 text-lg">Contact</h3>
      <div className="space-y-3">
        {profile.privacy.showCity && (profile.city || profile.province) && (
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-xl">📍</span>
            <span>{[profile.city, profile.province].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {profile.privacy.showOurEmail && profile.ourEmail && (
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-xl">✉️</span>
            <a
              href={`mailto:${profile.ourEmail}`}
              className="text-[#af2d17] hover:underline font-semibold text-lg"
            >
              {profile.ourEmail}
            </a>
          </div>
        )}
        {profile.privacy.showEmail && profile.email && (
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-xl">✉️</span>
            <a
              href={`mailto:${profile.email}`}
              className="text-[#af2d17] hover:underline"
            >
              {profile.email}
            </a>
          </div>
        )}
        {profile.privacy.showPhone && profile.phone && (
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-xl">📞</span>
            <a
              href={`tel:${profile.phone}`}
              className="text-[#af2d17] hover:underline"
            >
              {profile.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )

  // Render links section
  const LinksSection = () => (
    profile.isPremium && profile.privacy.showLinks && profile.customLinks.length > 0 ? (
      <div>
        <h3 className="font-bold text-[#af2d17] mb-4 text-lg">Links</h3>
        <div className="flex flex-wrap gap-4">
          {profile.customLinks.map((link) => (
            link.displayType === 'thumbnail' ? (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-28 group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden border-2 border-gray-200 group-hover:border-[#af2d17] transition-colors">
                  {link.thumbnailUrl ? (
                    <img src={link.thumbnailUrl} alt={link.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">🔗</div>
                  )}
                </div>
                <p className="text-sm text-center text-gray-700 group-hover:text-[#af2d17] truncate font-medium">
                  {link.label}
                </p>
              </a>
            ) : (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#af2d17]/10 text-[#af2d17] rounded-lg hover:bg-[#af2d17] hover:text-white transition-colors font-medium"
              >
                <span>🔗</span>
                {link.label || 'Link'}
              </a>
            )
          ))}
        </div>
      </div>
    ) : null
  )

  // Render social section
  const SocialSection = () => (
    profile.isPremium && profile.privacy.showSocial && profile.socialLinks.length > 0 ? (
      <div>
        <h3 className="font-bold text-[#af2d17] mb-4 text-lg">Connect</h3>
        <div className="flex flex-wrap gap-3">
          {profile.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#af2d17] rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all"
              title={SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.name}
            >
              <SocialIcon platform={link.platform} className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>
    ) : null
  )

  // For free users, use fixed two-column layout
  if (!profile.isPremium) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <nav className="bg-[#af2d17] text-white py-4">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
            <a href="/" className="text-3xl md:text-4xl font-bold">our.ca</a>
            <div className="flex items-center gap-2 md:gap-3">
              <a href="/search" className="px-3 md:px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
                search
              </a>
              <a href="/" className="px-3 md:px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
                home
              </a>
            </div>
          </div>
        </nav>

        {/* Profile Content - Fixed Layout */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left - Photo */}
            <div className="lg:w-2/5">
              <PhotoCarousel />
            </div>

            {/* Right - Info */}
            <div className="lg:w-3/5 space-y-6">
              <NameSection />
              <BioSection />
              <ContactSection />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#af2d17] text-white py-4 mt-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center md:text-left">
            <p className="text-sm opacity-80">
              Profile powered by <a href="/" className="font-bold hover:underline">our.ca</a> — Canada's modern directory
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Premium users get custom layout
  const layoutToUse = profile.layout.sort((a, b) => a.order - b.order)

  const renderBlock = (block: LayoutBlock) => {
    const components: Record<BlockType, JSX.Element | null> = {
      photos: profile.photos.length > 0 ? <PhotoCarousel /> : null,
      name: <NameSection />,
      bio: <BioSection />,
      contact: <ContactSection />,
      links: <LinksSection />,
      social: <SocialSection />,
    }
    return components[block.type]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="/" className="text-3xl md:text-4xl font-bold">our.ca</a>
          <div className="flex items-center gap-2 md:gap-3">
            <a href="/search" className="px-3 md:px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
              search
            </a>
            <a href="/" className="px-3 md:px-4 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all text-sm md:text-base">
              home
            </a>
          </div>
        </div>
      </nav>

      {/* Premium Profile Content - Custom Layout */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {layoutToUse.map((block) => {
            const content = renderBlock(block)
            return content ? (
              <div key={block.id} className="animate-fade-in">
                {content}
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#af2d17] text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center md:text-left">
          <p className="text-sm opacity-80">
            Profile powered by <a href="/" className="font-bold hover:underline">our.ca</a> — Canada's modern directory
          </p>
        </div>
      </div>
    </div>
  )
}
