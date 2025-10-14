"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProviderAvailabilityToggleProps {
  initialState: boolean;
  onToggle?: (newState: boolean) => void;
}

export default function ProviderAvailabilityToggle({
  initialState,
  onToggle,
}: ProviderAvailabilityToggleProps) {
  const [isActive, setIsActive] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:4001/api/profiles/provider/toggle-availability",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle availability");
      }

      const data = await response.json();
      const newState = data.isActive;

      setIsActive(newState);
      onToggle?.(newState);

      // Show success message
      const message = newState
        ? "You are now available for bookings!"
        : "You are now offline";
      alert(message);
    } catch (error) {
      console.error("Error toggling availability:", error);
      alert("Failed to update availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            isActive
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {isActive ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 2.83l2.829 2.829m2.829-2.829a4.978 4.978 0 001.414-2.83m0 0L11 11m6.464-6.464L21 21"
              />
            </svg>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">Availability Status</h3>
          <p className="text-sm text-gray-600">
            {isActive
              ? "You are online and visible to clients"
              : "You are offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isActive ? "Available" : "Offline"}
        </span>

        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-w-[100px] ${
            isActive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : isActive ? (
            "Go Offline"
          ) : (
            "Go Online"
          )}
        </button>
      </div>
    </div>
  );
}
