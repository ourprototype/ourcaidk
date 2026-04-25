'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createProfile } from '@/lib/actions/profile'
import type { ProfileType } from '@/lib/types/database'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState<'type' | 'info'>('type')
  const [profileType, setProfileType] = useState<ProfileType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    // Personal
    name: '',
    title: '',
    phone: '',
    city: '',
    province: '',
    // Business
    businessName: '',
    ownerName: '',
    category: '',
  })

  const handleTypeSelect = (type: ProfileType) => {
    setProfileType(type)
    // Pre-fill name from Clerk
    if (user?.fullName) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        ownerName: user.fullName || '',
      }))
    }
    setStep('info')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileType) return

    setIsSubmitting(true)
    setError('')

    try {
      const profileData = profileType === 'personal'
        ? {
            name: formData.name,
            title: formData.title,
            phone: formData.phone,
            city: formData.city,
            province: formData.province,
            email: user?.primaryEmailAddress?.emailAddress || '',
          }
        : {
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            name: formData.businessName,
            category: formData.category,
            phone: formData.phone,
            city: formData.city,
            province: formData.province,
            email: user?.primaryEmailAddress?.emailAddress || '',
          }

      const profile = await createProfile(profileType, profileData)

      if (profile) {
        router.push('/dashboard')
      } else {
        setError('Failed to create profile. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {step === 'type' ? (
          <>
            <h1 className="text-4xl font-bold text-[#af2d17] text-center mb-4">
              Welcome to Our.ca!
            </h1>
            <p className="text-xl text-gray-600 text-center mb-12">
              What type of profile would you like to create?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => handleTypeSelect('business')}
                className="px-12 py-8 bg-[#af2d17] text-white rounded-xl font-bold text-2xl hover:opacity-90 transition-opacity"
              >
                Business
                <p className="text-sm font-normal mt-2 opacity-80">
                  For companies, stores, services
                </p>
              </button>
              <button
                onClick={() => handleTypeSelect('personal')}
                className="px-12 py-8 border-4 border-[#af2d17] text-[#af2d17] rounded-xl font-bold text-2xl hover:bg-gray-50 transition-colors"
              >
                Personal
                <p className="text-sm font-normal mt-2 opacity-80">
                  For individuals, freelancers
                </p>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setStep('type')}
              className="text-[#af2d17] hover:underline mb-6 inline-block"
            >
              ← Back to profile type
            </button>

            <h1 className="text-3xl font-bold text-[#af2d17] mb-2">
              {profileType === 'business' ? 'Business' : 'Personal'} Profile
            </h1>
            <p className="text-gray-600 mb-8">
              Tell us a bit about {profileType === 'business' ? 'your business' : 'yourself'}
            </p>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {profileType === 'business' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name <span className="text-[#af2d17]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-[#af2d17]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    >
                      <option value="">Select a category...</option>
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
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-[#af2d17]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Software Developer, Designer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                    />
                  </div>
                </>
              )}

              {/* Shared fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
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

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#af2d17] text-white py-4 rounded font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Create My Profile'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
