import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
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

      <div className="flex justify-center py-16">
        <SignIn
          signUpUrl="/signup"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#af2d17] hover:bg-[#8f2513]',
              footerActionLink: 'text-[#af2d17] hover:text-[#8f2513]',
            }
          }}
        />
      </div>
    </div>
  )
}
