"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddressManager from "../../../../components/AddressManager";
import ClientHeader from "../../../../components/ClientHeader";
import { profileAPI } from "../../../../lib/api";
import { authUtils } from "../../../../lib/auth";

interface ClientProfile {
  id: string;
  name: string;
  age: number | null;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function ClientProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "" as string | number,
  });
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">(
    "profile"
  );

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authUtils.getUser();
    if (user?.role !== "CLIENT") {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getClientProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        age: response.data.age || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await profileAPI.updateClientProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age.toString()) : null,
      });

      await fetchProfile();
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-blue-100">
                  Manage your account settings and addresses
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard/client")}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              👤 Profile Info
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "addresses"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📍 Saved Addresses
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {!editing ? (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {profile?.name}
                        </h3>
                        <p className="text-gray-600">Client Account</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 border-2 border-gray-200 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Full Name
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile?.name}
                        </p>
                      </div>

                      <div className="p-6 border-2 border-gray-200 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Age
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile?.age || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {profile?.address && (
                      <div className="p-6 border-2 border-gray-200 rounded-xl">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Primary Address
                        </label>
                        <p className="text-lg text-gray-900">
                          {profile.address}
                        </p>
                        {(profile.city || profile.state) && (
                          <p className="text-gray-600 mt-1">
                            {profile.city}, {profile.state} {profile.zipCode}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Edit Profile
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age (Optional)
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="18"
                        max="120"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: profile?.name || "",
                            age: profile?.age || "",
                          });
                        }}
                        className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <AddressManager />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
