import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            BlueCollar <span className="text-primary-600">Freelancer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Connect with verified electricians, plumbers, carpenters, and skilled professionals in your area
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="card text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">All service providers are background-checked and verified</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Safe escrow payment system protects both clients and providers</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">Read reviews and ratings from previous customers</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link href="/login" className="btn btn-secondary text-lg px-8 py-3">
            Login
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">1000+</div>
            <div className="text-gray-600">Verified Providers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">5000+</div>
            <div className="text-gray-600">Jobs Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </main>
  )
}
