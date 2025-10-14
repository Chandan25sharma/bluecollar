"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLoader, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import LocationPicker from "../../../components/LocationPicker";
import { LocationData } from "../../../lib/location";

export default function ClientSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    name: "",
  });
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.phone
    )
      return "All fields are required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    if (!/^\+?[\d\s\-\(\)]+$/.test(form.phone))
      return "Please enter a valid phone number.";
    if (!location) return "Please select your location.";
    return "";
  };

  const handleLocationSelect = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
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
      if (!location) {
        setError("Please select your location.");
        return;
      }

      const signupData = {
        email: form.email,
        password: form.password,
        phone: form.phone,
        name: form.name,
        address: location.display_name,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        state: location.state,
      };

      const response = await fetch("/api/auth/client-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to client dashboard
        router.push("/dashboard/client");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
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

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Phone Number</label>
          <div className="flex items-center border rounded-lg px-3">
            <FiPhone className="text-gray-400" />
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-2 py-3 focus:outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Your Location</label>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            placeholder="Enter your address"
            required
            showCurrentLocationButton
          />
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
          {loading ? <FiLoader className="animate-spin text-xl" /> : "Sign Up"}
        </button>

        {/* Links */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
