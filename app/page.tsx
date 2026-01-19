'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [showSignupDropdown, setShowSignupDropdown] = useState(false)
  const [showYourInfoDropdown, setShowYourInfoDropdown] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<'business' | 'personal'>('personal')
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('Toronto, ON')

  useEffect(() => {
    // Check login state from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const type = localStorage.getItem('userType') as 'business' | 'personal' || 'personal'
    setIsLoggedIn(loggedIn)
    setUserType(type)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userType')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setShowYourInfoDropdown(false)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Red Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          
          <div className="flex gap-3 relative">
            {/* Sign Up Button - Always visible */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSignupDropdown(!showSignupDropdown)
                  setShowYourInfoDropdown(false)
                }}
                className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all"
              >
                sign up
              </button>

              {showSignupDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-[#af2d17] rounded shadow-lg py-2 min-w-[150px] z-50">
                  <a href="/signup?type=business" className="block px-4 py-2 hover:bg-gray-100">business</a>
                  <a href="/signup?type=personal" className="block px-4 py-2 hover:bg-gray-100">personal</a>
                </div>
              )}
            </div>

            {/* Your Info Button - Always visible */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowYourInfoDropdown(!showYourInfoDropdown)
                  setShowSignupDropdown(false)
                }}
                className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all"
              >
                your info
              </button>

              {showYourInfoDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-[#af2d17] rounded shadow-lg py-2 min-w-[150px] z-50">
                  {!isLoggedIn ? (
                    <a href="/login" className="block px-4 py-2 hover:bg-gray-100 font-medium">log in</a>
                  ) : (
                    <>
                      <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">edit info</a>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 border-t border-gray-200">log out</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-7xl font-bold text-[#af2d17] mb-16">
              Canada's modern directory.
            </h1>

            {/* Search Box */}
            <div className="max-w-3xl mx-auto mb-12">
              {/* Toggle */}
              <div className="flex justify-start gap-3 mb-6 text-lg">
                <button className="text-[#af2d17] font-medium underline underline-offset-4">All</button>
                <span className="text-gray-400">|</span>
                <button className="text-gray-600 hover:text-[#af2d17] font-medium">Businesses</button>
                <span className="text-gray-400">|</span>
                <button className="text-gray-600 hover:text-[#af2d17] font-medium">People</button>
              </div>

              {/* Search Input with Location */}
              <div className="flex border-2 border-[#af2d17] rounded overflow-hidden">
                <input
                  type="text"
                  placeholder="Search by name or phone number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 text-lg focus:outline-none"
                />
                <div className="flex items-center border-l-2 border-[#af2d17]">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="px-4 py-3 text-lg text-gray-600 focus:outline-none w-40 text-center"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-[#af2d17] text-white px-6 py-3 text-lg font-medium hover:bg-[#8f2513] transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Tagline */}
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700">
                The quickest way to find and be found. Your info, your way.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold">
            Your essential information, all in one place.
          </div>
          <div className="text-right flex items-center gap-4">
            <span className="text-lg font-bold">Get verified for $1.17/month.</span>
            <a href="/learn-more" className="underline hover:opacity-80">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
