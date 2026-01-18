'use client'

import { useSearchParams } from 'next/navigation'
import { searchData } from '@/lib/mockData'
import { useState } from 'react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = (searchParams.get('type') as 'all' | 'businesses' | 'people') || 'all'
  const location = searchParams.get('location') || ''
  
  const [sortBy, setSortBy] = useState<'relevance' | 'location'>('relevance')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  
  const { businesses, individuals } = searchData(query, type, location)
  
  const filteredBusinesses = showVerifiedOnly ? businesses.filter(b => b.verified) : businesses
  const filteredIndividuals = showVerifiedOnly ? individuals.filter(i => i.premium) : individuals
  
  const totalResults = filteredBusinesses.length + filteredIndividuals.length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
            back to home
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#af2d17] mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
            {location && ` in ${location}`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-50 border-2 border-[#af2d17] rounded-lg p-6 sticky top-8">
              <h3 className="font-bold text-lg text-[#af2d17] mb-6">Filters</h3>
              
              {/* Sort By */}
              <div className="mb-6">
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
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={showVerifiedOnly}
                      onChange={() => setShowVerifiedOnly(true)}
                      className="mr-2"
                    />
                    <span className="text-gray-700">Verified users only</span>
                  </label>
                </div>
              </div>

              {/* Keywords - LOCKED */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  Keywords 
                  <span className="text-lg">🔒</span>
                </h4>
                <div className="bg-gray-200 border-2 border-gray-400 rounded-lg p-4">
                  <input
                    type="text"
                    disabled
                    placeholder="Search by keywords..."
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white opacity-50 cursor-not-allowed text-sm"
                  />
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600 mb-2">Unlock with Premium</p>
                    <a href="/learn-more" className="text-xs font-medium text-[#af2d17] hover:underline">
                      Upgrade Now →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Side - Results */}
          <main className="flex-1">
            {/* Businesses */}
            {filteredBusinesses.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#af2d17] mb-4">Businesses</h2>
                <div className="space-y-4">
                  {filteredBusinesses.map((business) => (
                    <div 
                      key={business.id}
                      className="bg-white border-2 border-[#af2d17] rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Photo Placeholder */}
                        <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-3xl">
                          🏢
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[#af2d17]">{business.name}</h3>
                            {business.verified && (
                              <span className="bg-[#af2d17] text-white px-3 py-1 rounded-full text-xs font-bold">
                                ✓ VERIFIED
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-gray-700">
                            <p>📍 {business.city}, {business.province}</p>
                            <p>📞 {business.phone}</p>
                            {business.email && <p>✉️ {business.email}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individuals */}
            {filteredIndividuals.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#af2d17] mb-4">People</h2>
                <div className="space-y-4">
                  {filteredIndividuals.map((person) => (
                    <div 
                      key={person.id}
                      className="bg-white border-2 border-[#af2d17] rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Photo Placeholder */}
                        <div className="w-20 h-20 bg-[#af2d17] rounded-full flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-[#af2d17]">{person.name}</h3>
                            {person.premium && (
                              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                                PREMIUM
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-gray-700">
                            <p>📍 {person.city}, {person.province}</p>
                            {person.email && <p>✉️ {person.email}</p>}
                            {person.phone && <p>📞 {person.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  Try adjusting your search or filters
                </p>
                <a href="/" className="inline-block bg-[#af2d17] text-white px-8 py-3 rounded font-bold hover:opacity-90">
                  Back to Home
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
