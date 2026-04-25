'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { searchProfiles } from '@/lib/actions/profile'
import type { Profile } from '@/lib/types/database'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()

  const initialQuery = searchParams.get('q') || ''
  const type = (searchParams.get('type') as 'all' | 'businesses' | 'people') || 'all'
  const location = searchParams.get('location') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchLocation, setSearchLocation] = useState(location)
  const [searchType, setSearchType] = useState<'all' | 'businesses' | 'people'>(type)
  const [sortBy, setSortBy] = useState<'relevance' | 'location'>('relevance')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<Profile[]>([])

  // TODO: Check if user is verified/premium from their profile
  const [isUserVerified, setIsUserVerified] = useState(false)

  // Fetch results when search params change
  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true)

      // Parse location into city/province
      let city: string | undefined
      let province: string | undefined
      if (searchLocation) {
        const parts = searchLocation.split(',').map(s => s.trim())
        city = parts[0] || undefined
        province = parts[1] || undefined
      }

      const profileType = searchType === 'businesses' ? 'business' :
                          searchType === 'people' ? 'personal' : undefined

      const data = await searchProfiles(initialQuery, {
        type: profileType,
        city,
        province,
        verified: showVerifiedOnly || undefined,
      })

      setResults(data)
      setIsLoading(false)
    }

    fetchResults()
  }, [initialQuery, searchType, searchLocation, showVerifiedOnly])

  const handleSearchUpdate = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchLocation) params.set('location', searchLocation)
    if (searchType !== 'all') params.set('type', searchType)
    router.push(`/search?${params.toString()}`)
  }

  // Split results by type
  const businesses = results.filter(p => p.profile_type === 'business')
  const individuals = results.filter(p => p.profile_type === 'personal')
  const totalResults = results.length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
            home
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-[#af2d17]">Search Results for "</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchUpdate()}
              className="text-3xl font-bold text-[#af2d17] border-b-2 border-[#af2d17] focus:outline-none bg-transparent"
              style={{ width: `${Math.max(searchQuery.length, 1) * 18}px` }}
            />
            <span className="text-3xl font-bold text-[#af2d17]">"</span>
            <button
              onClick={handleSearchUpdate}
              className="ml-2 bg-[#af2d17] text-white px-4 py-1 rounded text-sm font-medium hover:bg-[#8f2513] transition-colors"
            >
              Update
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>
              {isLoading ? 'Searching...' : `${totalResults} ${totalResults === 1 ? 'result' : 'results'} found`}
            </span>
            <span>in</span>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchUpdate()}
              placeholder="Location"
              className="border-b-2 border-gray-400 focus:border-[#af2d17] focus:outline-none bg-transparent px-1"
              style={{ width: `${Math.max(searchLocation.length, 8) * 9}px` }}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-50 border-2 border-[#af2d17] rounded-lg p-6 sticky top-8">
              <h3 className="font-bold text-lg text-[#af2d17] mb-6">Filters</h3>

              {/* Type */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={searchType === 'all'}
                      onChange={() => setSearchType('all')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">All</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={searchType === 'businesses'}
                      onChange={() => setSearchType('businesses')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Businesses</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={searchType === 'people'}
                      onChange={() => setSearchType('people')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">People</span>
                  </label>
                </div>
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  Keywords
                  {!isUserVerified && <span className="text-lg">🔒</span>}
                </h4>
                <div className={`${!isUserVerified ? 'bg-gray-200 border-2 border-gray-400 opacity-50' : 'bg-white border-2 border-[#af2d17]'} rounded-lg p-4`}>
                  <input
                    type="text"
                    disabled={!isUserVerified}
                    placeholder="Add +"
                    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm ${!isUserVerified ? 'bg-white cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-[#af2d17]'}`}
                  />
                </div>
                {!isUserVerified && (
                  <p className="text-xs text-gray-500 mt-2">
                    <a href="/learn-more" className="text-[#af2d17] hover:underline">Get verified</a> to unlock
                  </p>
                )}
              </div>

              {/* Show */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Show</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!showVerifiedOnly}
                      onChange={() => setShowVerifiedOnly(false)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">All users</span>
                  </label>
                  <label className={`flex items-center ${isUserVerified ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                    <input
                      type="radio"
                      checked={showVerifiedOnly}
                      onChange={() => isUserVerified && setShowVerifiedOnly(true)}
                      disabled={!isUserVerified}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Verified users only</span>
                    {!isUserVerified && <span className="ml-2 text-lg">🔒</span>}
                  </label>
                  {!isUserVerified && (
                    <p className="text-xs text-gray-500 ml-5">
                      <a href="/learn-more" className="text-[#af2d17] hover:underline">Get verified</a> to unlock
                    </p>
                  )}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={sortBy === 'relevance'}
                      onChange={() => setSortBy('relevance')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Relevance</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={sortBy === 'location'}
                      onChange={() => setSortBy('location')}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Location</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Side - Results */}
          <main className="flex-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : (
              <>
                {/* Businesses */}
                {businesses.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#af2d17] mb-4">Businesses</h2>
                    <div className="space-y-4">
                      {businesses.map((business) => (
                        <a
                          key={business.id}
                          href={`/profile/${business.id}`}
                          className="block bg-white border-2 border-[#af2d17] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <div className="flex gap-4">
                            {/* Photo Placeholder */}
                            <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-3xl">
                              🏢
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-[#af2d17]">
                                  {business.business_name || business.name}
                                </h3>
                                {business.is_verified && (
                                  <span className="bg-[#af2d17] text-white px-3 py-1 rounded-full text-xs font-bold">
                                    ✓ VERIFIED
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 text-gray-700">
                                {(business.city || business.province) && (
                                  <p>📍 {[business.city, business.province].filter(Boolean).join(', ')}</p>
                                )}
                                {business.phone && <p>📞 {business.phone}</p>}
                                {business.our_email && <p>✉️ {business.our_email}</p>}
                                {business.category && (
                                  <p className="text-sm text-gray-500">{business.category}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individuals */}
                {individuals.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#af2d17] mb-4">People</h2>
                    <div className="space-y-4">
                      {individuals.map((person) => (
                        <a
                          key={person.id}
                          href={`/profile/${person.id}`}
                          className="block bg-white border-2 border-[#af2d17] rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                          <div className="flex gap-4">
                            {/* Photo Placeholder */}
                            <div className="w-20 h-20 bg-[#af2d17] rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white">
                              {person.name ? person.name.split(' ').map(n => n[0]).join('') : '?'}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-[#af2d17]">{person.name}</h3>
                                {person.is_premium && (
                                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                                    PREMIUM
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 text-gray-700">
                                {person.title && <p className="text-gray-600">{person.title}</p>}
                                {(person.city || person.province) && (
                                  <p>📍 {[person.city, person.province].filter(Boolean).join(', ')}</p>
                                )}
                                {person.our_email && <p>✉️ {person.our_email}</p>}
                                {person.phone && <p>📞 {person.phone}</p>}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                  <div className="bg-gray-50 border-2 border-[#af2d17] rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-[#af2d17] mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">
                      {initialQuery ? 'Try adjusting your search or filters' : 'Start searching to find businesses and people'}
                    </p>
                    <a href="/" className="inline-block bg-[#af2d17] text-white px-8 py-3 rounded font-bold hover:opacity-90">
                      Back to Home
                    </a>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
