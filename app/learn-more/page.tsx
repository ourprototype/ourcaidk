'use client'

import { useState } from 'react'

export default function LearnMorePage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
            back to home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* CTA Message */}
        <div className="text-center mb-8">
          <h1 className="text-[#af2d17] font-bold text-6xl">
            Our hub for contact information.
          </h1>
        </div>

        {/* Billing Toggle */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-xl p-1.5 gap-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-[#af2d17] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-[#af2d17] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="text-green-600 text-sm ml-1">Save 33%</span>
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="flex-1 flex items-end">
          <div className="max-w-6xl mx-auto w-full pb-8">
            <div className="grid md:grid-cols-2 gap-8">

              {/* BUSINESS COLUMN */}
              <div className="flex flex-col">
                <div className="bg-[#af2d17] text-white text-center py-3 rounded-t-xl">
                  <h2 className="text-2xl font-bold">Business</h2>
                </div>

                <div className="grid grid-cols-2 border-2 border-t-0 border-[#af2d17] rounded-b-xl overflow-hidden flex-1">
                  {/* Basic */}
                  <div className="p-5 border-r border-gray-200 bg-gray-50 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800">Basic</h3>
                    <div className="text-2xl font-bold text-gray-800 mb-4">Free</div>

                    <ul className="space-y-2 text-sm text-gray-700 flex-1">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>Basic listing (name, phone, address)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>Standard search placement</span>
                      </li>
                    </ul>

                    <a href="/signup?type=business" className="block mt-5 text-center py-2.5 border-2 border-[#af2d17] text-[#af2d17] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Claim Free
                    </a>
                  </div>

                  {/* Verified */}
                  <div className="p-5 bg-white relative flex flex-col">
                    <div className="absolute top-0 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-b-lg font-medium">
                      RECOMMENDED
                    </div>
                    <h3 className="text-xl font-bold text-[#af2d17]">Verified</h3>
                    <div className="mb-4">
                      {billingPeriod === 'monthly' ? (
                        <span className="text-2xl font-bold text-[#af2d17]">$2.99<span className="text-sm font-normal">/mo</span></span>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-[#af2d17]">$24<span className="text-sm font-normal">/yr</span></span>
                          <span className="text-sm text-green-600 ml-2">($2/mo)</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 text-sm text-gray-700 flex-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Full customization (photos, description, hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Links (website, social, menus/files)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>@our.ca email with forwarding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Verification badge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Search ranking prioritization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Ratings</span>
                      </li>
                    </ul>

                    <a href="/signup?type=business&plan=verified" className="block mt-5 text-center py-2.5 bg-[#af2d17] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Get Verified
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div></div>
                  <p className="text-center text-[#af2d17] mt-3 font-bold text-lg">
                    3 months free
                  </p>
                </div>
              </div>

              {/* PERSONAL COLUMN */}
              <div className="flex flex-col">
                <div className="bg-[#af2d17] text-white text-center py-3 rounded-t-xl">
                  <h2 className="text-2xl font-bold">Personal</h2>
                </div>

                <div className="grid grid-cols-2 border-2 border-t-0 border-[#af2d17] rounded-b-xl overflow-hidden flex-1">
                  {/* Free */}
                  <div className="p-5 border-r border-gray-200 bg-gray-50 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800">Free</h3>
                    <div className="text-2xl font-bold text-gray-800 mb-4">Free</div>

                    <ul className="space-y-2 text-sm text-gray-700 flex-1">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>Basic profile info</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>1 photo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>Email OR phone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">✓</span>
                        <span>Standard search placement</span>
                      </li>
                    </ul>

                    <a href="/signup?type=personal" className="block mt-5 text-center py-2.5 border-2 border-[#af2d17] text-[#af2d17] rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Sign Up Free
                    </a>
                  </div>

                  {/* Premium */}
                  <div className="p-5 bg-white relative flex flex-col">
                    <div className="absolute top-0 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-b-lg font-medium">
                      RECOMMENDED
                    </div>
                    <h3 className="text-xl font-bold text-[#af2d17]">Premium</h3>
                    <div className="mb-4">
                      {billingPeriod === 'monthly' ? (
                        <span className="text-2xl font-bold text-[#af2d17]">$1.99<span className="text-sm font-normal">/mo</span></span>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-[#af2d17]">$14<span className="text-sm font-normal">/yr</span></span>
                          <span className="text-sm text-green-600 ml-2">($1.17/mo)</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-2 text-sm text-gray-700 flex-1">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Full customization (layout, photos, cover, bio)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Links (social, website previews, files)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>@our.ca email with forwarding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Higher search ranking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Keyword discovery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span className="font-medium">Privacy controls</span>
                      </li>
                    </ul>

                    <a href="/signup?type=personal&plan=premium" className="block mt-5 text-center py-2.5 bg-[#af2d17] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                      Go Premium
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div></div>
                  <p className="text-center text-[#af2d17] mt-3 font-bold text-lg">
                    6 months free
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
