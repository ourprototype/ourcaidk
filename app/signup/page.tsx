'use client'

import { useState } from 'react'

export default function SignupPage() {
  const [accountType, setAccountType] = useState<'business' | 'personal'>('business')
  const [showOptional, setShowOptional] = useState(false)

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

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-[#af2d17] text-center mb-12">
          Create Your Profile
        </h1>

        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setAccountType('business')
              setShowOptional(false)
            }}
            className={`px-8 py-3 rounded font-bold text-lg transition-all ${
              accountType === 'business'
                ? 'bg-[#af2d17] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => {
              setAccountType('personal')
              setShowOptional(false)
            }}
            className={`px-8 py-3 rounded font-bold text-lg transition-all ${
              accountType === 'personal'
                ? 'bg-[#af2d17] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Personal
          </button>
        </div>

        {/* Business Form */}
        {accountType === 'business' && (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name <span className="text-[#af2d17]">*</span>
              </label>
              <input type="text" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-[#af2d17]">*</span>
              </label>
              <input type="email" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-[#af2d17]">*</span>
              </label>
              <input type="tel" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-[#af2d17]">*</span>
              </label>
              <input type="password" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
            </div>

            {!showOptional && (
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="text-[#af2d17] font-medium hover:underline"
              >
                + Add optional information (address, hours, description, etc.)
              </button>
            )}

            {showOptional && (
              <div className="space-y-6 pt-4 border-t-2 border-gray-200">
                <p className="text-sm text-gray-600">Optional - you can add this later</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <select className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]">
                      <option value="">Select...</option>
                      <option value="ON">Ontario</option>
                      <option value="BC">British Columbia</option>
                      <option value="AB">Alberta</option>
                      <option value="QC">Quebec</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]">
                    <option value="">Select...</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail</option>
                    <option value="professional">Professional Services</option>
                    <option value="health">Healthcare</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input type="url" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                  <input type="text" placeholder="e.g., Mon-Fri: 9am-5pm" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea rows={3} className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <label className="text-sm text-gray-700">
                I own/manage this business and agree to the Terms of Service
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-[#af2d17] text-white py-3 rounded font-bold hover:opacity-90 transition-opacity">
                Create Account
              </button>
              {showOptional && (
                <button type="button" className="flex-1 bg-white text-[#af2d17] py-3 rounded font-bold border-2 border-[#af2d17] hover:bg-gray-50 transition-colors">
                  Skip Optional Fields
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-600 pt-4">
              Already listed?{' '}
              <a href="/claim" className="text-[#af2d17] font-medium hover:underline">
                Claim your profile
              </a>
            </p>
          </form>
        )}

        {/* Personal Form */}
        {accountType === 'personal' && (
          <div>
            {/* Premium Promo */}
            <div className="bg-yellow-50 border-4 border-yellow-400 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⭐</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">First 7,500 users get 3 months premium free!</h3>
                  <p className="text-gray-700">5,342 spots remaining</p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-[#af2d17]">*</span>
                </label>
                <input type="text" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email OR Phone <span className="text-[#af2d17]">*</span>
                </label>
                <input type="text" required placeholder="Enter email or phone number" className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-[#af2d17]">*</span>
                </label>
                <input type="password" required className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
              </div>

              {!showOptional && (
                <button
                  type="button"
                  onClick={() => setShowOptional(true)}
                  className="text-[#af2d17] font-medium hover:underline"
                >
                  + Add optional information (location, job title, bio, photo)
                </button>
              )}

              {showOptional && (
                <div className="space-y-6 pt-4 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-600">Optional - you can add this later</p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" placeholder="City, Province" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input type="text" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio (50 characters)</label>
                    <input type="text" maxLength={50} className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <input type="file" accept="image/*" className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-[#af2d17] text-white py-3 rounded font-bold hover:opacity-90 transition-opacity">
                  Create Free Profile
                </button>
                {showOptional && (
                  <button type="button" className="flex-1 bg-white text-[#af2d17] py-3 rounded font-bold border-2 border-[#af2d17] hover:bg-gray-50 transition-colors">
                    Skip Optional Fields
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
