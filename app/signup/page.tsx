'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Simulated taken usernames for demo
const takenUsernames = ['admin', 'support', 'info', 'contact', 'hello', 'max', 'jane']

export default function SignupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeParam = searchParams.get('type') as 'business' | 'personal' | null

  const [showOptional, setShowOptional] = useState(false)

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    province: '',
    category: '',
    website: '',
    hours: ''
  })

  // Personal form state
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    location: '',
    jobTitle: '',
    bio: ''
  })

  // @our.ca email claiming
  const [wantOurEmail, setWantOurEmail] = useState(false)
  const [ourEmailUsername, setOurEmailUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  const checkUsername = (username: string) => {
    setOurEmailUsername(username)
    if (!username) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    // Simulate API call
    setTimeout(() => {
      if (takenUsernames.includes(username.toLowerCase())) {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('available')
      }
    }, 500)
  }

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Store all data in localStorage
    const profileData = {
      type: 'business',
      name: businessForm.businessName,
      ownerName: businessForm.ownerName,
      email: businessForm.email,
      phone: businessForm.phone,
      address: businessForm.address,
      city: businessForm.city,
      province: businessForm.province,
      category: businessForm.category,
      website: businessForm.website,
      hours: businessForm.hours,
      description: '',
      verified: false,
      ourEmail: wantOurEmail && usernameStatus === 'available' ? `${ourEmailUsername}@our.ca` : '',
      photos: []
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userType', 'business')
    localStorage.setItem('profileData', JSON.stringify(profileData))
    router.push('/dashboard?type=business')
  }

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse location into city/province if provided
    let city = ''
    let province = ''
    if (personalForm.location) {
      const parts = personalForm.location.split(',').map(s => s.trim())
      city = parts[0] || ''
      province = parts[1] || ''
    }

    // Store all data in localStorage
    const profileData = {
      type: 'personal',
      name: personalForm.fullName,
      email: personalForm.emailOrPhone.includes('@') ? personalForm.emailOrPhone : '',
      phone: !personalForm.emailOrPhone.includes('@') ? personalForm.emailOrPhone : '',
      city,
      province,
      title: personalForm.jobTitle,
      bio: personalForm.bio,
      premium: false,
      ourEmail: wantOurEmail && usernameStatus === 'available' ? `${ourEmailUsername}@our.ca` : '',
      socialLinks: { linkedin: '', twitter: '', instagram: '' },
      websiteLinks: [],
      privacy: { showEmail: true, showPhone: true, showSocial: true }
    }

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userType', 'personal')
    localStorage.setItem('profileData', JSON.stringify(profileData))
    router.push('/dashboard?type=personal')
  }

  // If no type specified, show choice page
  if (!typeParam) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="bg-[#af2d17] text-white py-4">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a href="/" className="text-4xl font-bold">our.ca</a>
            <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
              home
            </a>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-[#af2d17] mb-4">
            Create Your Profile
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            What type of account would you like to create?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/signup?type=business"
              className="px-12 py-6 bg-[#af2d17] text-white rounded-xl font-bold text-2xl hover:opacity-90 transition-opacity"
            >
              Business
            </a>
            <a
              href="/signup?type=personal"
              className="px-12 py-6 border-4 border-[#af2d17] text-[#af2d17] rounded-xl font-bold text-2xl hover:bg-gray-50 transition-colors"
            >
              Personal
            </a>
          </div>
        </div>
      </div>
    )
  }

  // @our.ca Email Claiming Component
  const OurEmailClaim = () => (
    <div className="pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="wantOurEmail"
          checked={wantOurEmail}
          onChange={(e) => setWantOurEmail(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="wantOurEmail" className="text-sm font-medium text-gray-700">
          Claim your free @our.ca email address
        </label>
      </div>

      {wantOurEmail && (
        <div className="ml-6 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="yourname"
              value={ourEmailUsername}
              onChange={(e) => checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
            />
            <span className="text-gray-600 font-medium">@our.ca</span>
          </div>

          {usernameStatus === 'checking' && (
            <p className="text-sm text-gray-500">Checking availability...</p>
          )}
          {usernameStatus === 'available' && ourEmailUsername && (
            <p className="text-sm text-green-600 font-medium">
              {ourEmailUsername}@our.ca is available!
            </p>
          )}
          {usernameStatus === 'taken' && (
            <p className="text-sm text-red-600 font-medium">
              This username is already taken. Try another.
            </p>
          )}

          <p className="text-xs text-gray-500">
            Get a professional @our.ca email that forwards to your personal email.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
            home
          </a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#af2d17] text-center mb-2">
          {typeParam === 'business' ? 'Business' : 'Personal'} Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-8">
          <a href="/signup" className="text-[#af2d17] hover:underline">← Choose a different account type</a>
        </p>

        {/* Business Form */}
        {typeParam === 'business' && (
          <form className="space-y-3" onSubmit={handleBusinessSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-[#af2d17]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessForm.businessName}
                  onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-[#af2d17]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessForm.ownerName}
                  onChange={(e) => setBusinessForm({...businessForm, ownerName: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-[#af2d17]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-[#af2d17]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-[#af2d17]">*</span>
              </label>
              <input
                type="password"
                required
                value={businessForm.password}
                onChange={(e) => setBusinessForm({...businessForm, password: e.target.value})}
                className="w-full px-3 py-2 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
              />
            </div>

            {!showOptional && (
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="text-[#af2d17] font-medium hover:underline text-sm"
              >
                + Add optional information (address, hours, description, etc.)
              </button>
            )}

            {showOptional && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Optional - you can add this later</p>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={businessForm.city}
                      onChange={(e) => setBusinessForm({...businessForm, city: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <select
                      value={businessForm.province}
                      onChange={(e) => setBusinessForm({...businessForm, province: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={businessForm.category}
                      onChange={(e) => setBusinessForm({...businessForm, category: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    >
                      <option value="">Select...</option>
                      <option value="Restaurant & Food">Restaurant & Food</option>
                      <option value="Retail & Shopping">Retail & Shopping</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                      <option value="Home Services">Home Services</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment & Recreation">Entertainment & Recreation</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance & Insurance">Finance & Insurance</option>
                      <option value="Non-Profit & Community">Non-Profit & Community</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={businessForm.website}
                      onChange={(e) => setBusinessForm({...businessForm, website: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                  <input
                    type="text"
                    placeholder="e.g., Mon-Fri: 9am-5pm"
                    value={businessForm.hours}
                    onChange={(e) => setBusinessForm({...businessForm, hours: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                  />
                </div>
              </div>
            )}

            <OurEmailClaim />

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" required />
              <label className="text-sm text-gray-700">
                I own/manage this business and agree to the Terms of Service
              </label>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-center text-gray-700 mb-3">
                Create your listing and get <span className="font-bold text-[#af2d17]">3 months Verified free!</span>
              </p>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#af2d17] text-white py-2.5 rounded font-bold hover:opacity-90 transition-opacity">
                  Get Verified
                </button>
                <button type="submit" className="flex-1 border-2 border-gray-300 text-gray-600 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors">
                  Stay Basic
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-3">
                Already listed? <a href="/claim" className="text-[#af2d17] font-medium hover:underline">Claim your profile</a>
              </p>
            </div>
          </form>
        )}

        {/* Personal Form */}
        {typeParam === 'personal' && (
          <form className="space-y-4" onSubmit={handlePersonalSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-[#af2d17]">*</span>
              </label>
              <input
                type="text"
                required
                value={personalForm.fullName}
                onChange={(e) => setPersonalForm({...personalForm, fullName: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email OR Phone <span className="text-[#af2d17]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter email or phone number"
                value={personalForm.emailOrPhone}
                onChange={(e) => setPersonalForm({...personalForm, emailOrPhone: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-[#af2d17]">*</span>
              </label>
              <input
                type="password"
                required
                value={personalForm.password}
                onChange={(e) => setPersonalForm({...personalForm, password: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
              />
            </div>

            {!showOptional && (
              <button
                type="button"
                onClick={() => setShowOptional(true)}
                className="text-[#af2d17] font-medium hover:underline text-sm"
              >
                + Add optional information (location, job title, bio, photo)
              </button>
            )}

            {showOptional && (
              <div className="space-y-4 pt-3 border-t-2 border-gray-200">
                <p className="text-xs text-gray-500">Optional - you can add this later</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, Province"
                    value={personalForm.location}
                    onChange={(e) => setPersonalForm({...personalForm, location: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={personalForm.jobTitle}
                    onChange={(e) => setPersonalForm({...personalForm, jobTitle: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={personalForm.bio}
                    onChange={(e) => setPersonalForm({...personalForm, bio: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                  />
                </div>
              </div>
            )}

            <OurEmailClaim />

            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-gray-700 mb-4">
                Create your profile and get <span className="font-bold text-[#af2d17]">6 months of Premium free!</span>
              </p>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#af2d17] text-white py-3 rounded font-bold hover:opacity-90 transition-opacity">
                  Upgrade Now
                </button>
                <button type="submit" className="flex-1 border-2 border-gray-300 text-gray-600 py-3 rounded font-medium hover:bg-gray-50 transition-colors">
                  Miss Out
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
