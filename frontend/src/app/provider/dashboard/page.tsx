'use client'

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your services and bookings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">My Services</h3>
            <p className="text-gray-600 mb-4">Create and manage your service listings</p>
            <button className="btn btn-primary">Manage Services</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage client bookings</p>
            <button className="btn btn-secondary">View Bookings</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Earnings</h3>
            <p className="text-gray-600 mb-4">Track your income and payments</p>
            <button className="btn btn-secondary">View Earnings</button>
          </div>
        </div>
      </div>
    </div>
  )
}
