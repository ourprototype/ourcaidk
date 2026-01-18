export default function LearnMorePage() {
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

      {/* Hero Message */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold text-[#af2d17] mb-6">
            Your essential information, all in one place.
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Choose exactly how you want to be found.
          </p>
          <p className="text-2xl text-gray-700 mb-4">
            Establish your unified identity.
          </p>
          <p className="text-2xl text-gray-700">
            With an @our.ca email address, too.
          </p>
        </div>
      </section>

      {/* Side-by-Side Comparison */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* BUSINESSES */}
            <div>
              <h2 className="text-4xl font-bold text-[#af2d17] mb-8">Businesses</h2>
              
              {/* Free/Unclaimed */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-4">Unclaimed</h3>
                <p className="text-lg text-gray-700 mb-4">
                  You're listed. But it's not really yours.
                </p>
                <p className="text-gray-600 mb-4">
                  Basic info. No photos. No control. Standard placement.
                </p>
                <p className="font-medium text-[#af2d17]">
                  → Claim your profile free. Take control.
                </p>
              </div>

              {/* Verified */}
              <div className="border-4 border-[#af2d17] rounded-lg p-8">
                <h3 className="text-3xl font-bold mb-2">Verified</h3>
                <p className="text-xl text-[#af2d17] font-bold mb-6">$2.99/month or $24/year</p>
                
                <p className="text-lg font-bold mb-4">Your business. Your rules. Priority visibility.</p>
                
                <div className="space-y-3 text-gray-700">
                  <p>• Upload your logo and 7 photos</p>
                  <p>• Display your email and business hours</p>
                  <p>• Write your own description</p>
                  <p>• Link to your website and social media</p>
                  <p>• Get the verification badge customers trust</p>
                  <p>• Rank higher in search results</p>
                  <p>• Customize your colors and fonts to match your brand</p>
                  <p>• Professional @our.ca email included</p>
                </div>

                <p className="mt-6 text-sm text-gray-600 italic">
                  For less than a coffee, you control how customers find you.
                </p>

                <p className="mt-4 font-bold text-[#af2d17]">
                  First 5,000 businesses: 3 months free.
                </p>
              </div>
            </div>

            {/* PERSONAL */}
            <div>
              <h2 className="text-4xl font-bold text-[#af2d17] mb-8">Personal</h2>
              
              {/* Free */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-4">Free</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Be findable. Keep it simple.
                </p>
                <p className="text-gray-600 mb-4">
                  One photo. Basic info. Limited visibility.
                </p>
                <p className="font-medium">
                  Good enough to be found.
                </p>
              </div>

              {/* Premium */}
              <div className="border-4 border-[#af2d17] rounded-lg p-8">
                <h3 className="text-3xl font-bold mb-2">Premium</h3>
                <p className="text-xl text-[#af2d17] font-bold mb-6">$1.99/month or $14/year</p>
                
                <p className="text-lg font-bold mb-4">Your identity. Fully under your control.</p>
                
                <div className="space-y-3 text-gray-700">
                  <p>• Multiple photos and custom cover image</p>
                  <p>• Fully customizable layout—design it your way</p>
                  <p>• Choose your own colors and fonts</p>
                  <p>• Display email AND phone</p>
                  <p>• Link to your portfolio, social media, and website</p>
                  <p>• Be discovered by keywords (others search "photographer Toronto" and find you)</p>
                  <p>• Privacy controls—decide who sees what</p>
                  <p>• Professional @our.ca email included</p>
                </div>

                <p className="mt-6 text-sm text-gray-600 italic">
                  Your personal website—without building a website.
                </p>

                <p className="mt-4 font-bold text-[#af2d17]">
                  First 7,500 users: 3 months free. 5,342 spots left.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#af2d17] mb-8">Why upgrade?</h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h3 className="text-2xl font-bold mb-4">For businesses:</h3>
              <p className="text-lg text-gray-700">
                Verified profiles rank higher, look more professional, and get more customers. For $2.99/month, you control your reputation.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">For individuals:</h3>
              <p className="text-lg text-gray-700">
                Premium profiles get found. Freelancers, consultants, and professionals who want to be discoverable choose premium.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              The question isn't "should I upgrade?"
            </p>
            <p className="text-3xl font-bold text-[#af2d17]">
              It's "can I afford not to?"
            </p>
          </div>

          <div className="mt-12">
            <a href="/signup" className="inline-block bg-[#af2d17] text-white px-12 py-4 rounded text-xl font-bold hover:opacity-90 transition-opacity">
              Get Started Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-[#af2d17] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">
            the hub for essential information
          </div>
          <div className="text-right">
            <a href="/" className="text-lg underline hover:opacity-80">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
