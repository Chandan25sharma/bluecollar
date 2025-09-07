"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    // Mock API call
    setServices([
      { id: "1", name: "Plumbing", category: "Home Repair", description: "Fix leaks, pipes, and more" },
      { id: "2", name: "Electrician", category: "Home Repair", description: "Wiring, lighting, appliances" },
    ]);
  }, []);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      <div className="mb-6">
        <Link
          href="/dashboard/admin/services/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Service
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Service</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No services yet.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">{s.description}</td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/admin/services/${s.id}`}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
