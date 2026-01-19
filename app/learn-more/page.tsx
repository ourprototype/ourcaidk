'use client'

import { useState } from 'react'

export default function LearnMorePage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="bg-[#af2d17] text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-4xl font-bold">our.ca</a>
          <a href="/" className="px-6 py-2 border-2 border-white rounded hover:bg-white hover:text-[#af2d17] transition-all">
            home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-4">
        {/* CTA Message */}
        <div className="text-center mb-4">
          <h1 className="text-[#af2d17] font-bold text-4xl">
            Our hub for contact information.
          </h1>
        </div>

        {/* Billing Toggle */}
        <div className="text-center mb-4">
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-[#af2d17] shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-[#af2d17] shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="text-green-600 text-xs ml-1">Save 33%</span>
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="flex-1 max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-5 h-full">

            {/* BUSINESS COLUMN */}
            <div className="flex flex-col">
              <div className="bg-[#af2d17] text-white text-center py-2 rounded-t-lg">
                <h2 className="text-lg font-bold">Business</h2>
              </div>

              <div className="grid grid-cols-2 border-2 border-t-0 border-[#af2d17] rounded-b-lg overflow-hidden flex-1">
                {/* Basic */}
                <div className="p-3 border-r border-gray-200 bg-gray-50 flex flex-col">
                  <h3 className="text-base font-bold text-gray-800">Basic</h3>
                  <div className="text-lg font-bold text-gray-800 mb-2">Free</div>

                  <ul className="space-y-1 text-xs text-gray-700 flex-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>Basic listing (name, phone, address)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>Standard search placement</span>
                    </li>
                  </ul>

                  <a href="/signup?type=business" className="block mt-3 text-center py-2 border-2 border-[#af2d17] text-[#af2d17] rounded text-sm font-medium hover:bg-gray-100">
                    Claim Free
                  </a>
                </div>

                {/* Verified */}
                <div className="p-3 bg-white relative flex flex-col">
                  <div className="absolute top-0 right-2 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-b font-medium">
                    RECOMMENDED
                  </div>
                  <h3 className="text-base font-bold text-[#af2d17]">Verified</h3>
                  <div className="mb-2">
                    {billingPeriod === 'monthly' ? (
                      <span className="text-lg font-bold text-[#af2d17]">$2.99<span className="text-xs font-normal">/mo</span></span>
                    ) : (
                      <div>
                        <span className="text-lg font-bold text-[#af2d17]">$24<span className="text-xs font-normal">/yr</span></span>
                        <span className="text-xs text-green-600 ml-1">($2/mo)</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-1 text-xs text-gray-700 flex-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>Full customization (photos, description, hours)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>Links (website, social, menus/files)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>@our.ca email with forwarding</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Verification badge</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Search ranking prioritization</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Ratings</span>
                    </li>
                  </ul>

                  <a href="/signup?type=business&plan=verified" className="block mt-3 text-center py-2 bg-[#af2d17] text-white rounded text-sm font-medium hover:opacity-90">
                    Get Verified
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div></div>
                <p className="text-center text-[#af2d17] mt-2 font-bold text-sm">
                  3 months free
                </p>
              </div>
            </div>

            {/* PERSONAL COLUMN */}
            <div className="flex flex-col">
              <div className="bg-[#af2d17] text-white text-center py-2 rounded-t-lg">
                <h2 className="text-lg font-bold">Personal</h2>
              </div>

              <div className="grid grid-cols-2 border-2 border-t-0 border-[#af2d17] rounded-b-lg overflow-hidden flex-1">
                {/* Free */}
                <div className="p-3 border-r border-gray-200 bg-gray-50 flex flex-col">
                  <h3 className="text-base font-bold text-gray-800">Free</h3>
                  <div className="text-lg font-bold text-gray-800 mb-2">Free</div>

                  <ul className="space-y-1 text-xs text-gray-700 flex-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>Basic profile info</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>1 photo</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>Email OR phone</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-gray-400">✓</span>
                      <span>Standard search placement</span>
                    </li>
                  </ul>

                  <a href="/signup?type=personal" className="block mt-3 text-center py-2 border-2 border-[#af2d17] text-[#af2d17] rounded text-sm font-medium hover:bg-gray-100">
                    Sign Up Free
                  </a>
                </div>

                {/* Premium */}
                <div className="p-3 bg-white relative flex flex-col">
                  <div className="absolute top-0 right-2 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-b font-medium">
                    RECOMMENDED
                  </div>
                  <h3 className="text-base font-bold text-[#af2d17]">Premium</h3>
                  <div className="mb-2">
                    {billingPeriod === 'monthly' ? (
                      <span className="text-lg font-bold text-[#af2d17]">$1.99<span className="text-xs font-normal">/mo</span></span>
                    ) : (
                      <div>
                        <span className="text-lg font-bold text-[#af2d17]">$14<span className="text-xs font-normal">/yr</span></span>
                        <span className="text-xs text-green-600 ml-1">($1.17/mo)</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-1 text-xs text-gray-700 flex-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>Full customization (layout, photos, cover, bio)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>Links (social, website previews, files)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span>@our.ca email with forwarding</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Higher search ranking</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Keyword discovery</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600">✓</span>
                      <span className="font-medium">Privacy controls</span>
                    </li>
                  </ul>

                  <a href="/signup?type=personal&plan=premium" className="block mt-3 text-center py-2 bg-[#af2d17] text-white rounded text-sm font-medium hover:opacity-90">
                    Go Premium
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div></div>
                <p className="text-center text-[#af2d17] mt-2 font-bold text-sm">
                  6 months free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
