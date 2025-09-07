"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: "", description: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("New service created (mock)");
    // Later: POST → /api/services
    router.push("/dashboard/admin/services");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block mb-1 font-semibold">Service Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="e.g. Home Repair"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
