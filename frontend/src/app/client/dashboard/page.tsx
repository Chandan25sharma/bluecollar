'use client'

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Find and book services from verified providers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Browse Services</h3>
            <p className="text-gray-600 mb-4">Find qualified professionals in your area</p>
            <button className="btn btn-primary">Find Services</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-4">View and manage your appointments</p>
            <button className="btn btn-secondary">View Bookings</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-4">Update your profile and preferences</p>
            <button className="btn btn-secondary">Manage Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
