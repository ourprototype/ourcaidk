'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login with:', emailOrPhone, password)
  }

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

      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-[#af2d17] text-center mb-12">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
              placeholder="Enter your email or phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-[#af2d17] rounded focus:outline-none focus:ring-2 focus:ring-[#af2d17]"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <a href="/forgot-password" className="text-sm text-[#af2d17] hover:underline">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="w-full bg-[#af2d17] text-white py-3 rounded font-bold hover:opacity-90 transition-opacity">
            Log In
          </button>

          <p className="text-center text-sm text-gray-600 pt-4">
            Don't have an account?{' '}
            <a href="/signup" className="text-[#af2d17] font-medium hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
