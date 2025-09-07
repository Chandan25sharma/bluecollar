"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiLoader } from "react-icons/fi";

export default function ClientSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return "All fields are required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "client",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Save token if backend returns it (or fetch login separately)
      // localStorage.setItem("token", data.token);

      router.push("/client/login"); // redirect to login after signup
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Client Account
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Full Name</label>
          <div className="flex items-center border rounded-lg px-3">
            <FiUser className="text-gray-400" />
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-2 py-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <div className="flex items-center border rounded-lg px-3">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-2 py-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Password</label>
          <div className="flex items-center border rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-2 py-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Confirm Password</label>
          <div className="flex items-center border rounded-lg px-3">
            <FiLock className="text-gray-400" />
            <input
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-2 py-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center hover:bg-blue-700 transition"
        >
          {loading ? (
            <FiLoader className="animate-spin text-xl" />
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Links */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/client/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
