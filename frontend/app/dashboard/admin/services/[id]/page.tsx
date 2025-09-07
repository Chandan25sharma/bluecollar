"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: "", description: "" });

  useEffect(() => {
    // Mock fetch service by ID
    setForm({
      name: "Plumbing",
      category: "Home Repair",
      description: "Fix leaks, pipes, installations",
    });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Service updated (mock)");
    // Later: PUT → /api/services/[id]
    router.push("/dashboard/admin/services");
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
