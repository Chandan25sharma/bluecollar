"use client";

import { useRouter } from "next/navigation";

export default function SignupChoicePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h1>
        <p className="text-gray-600 mb-8">
          Choose your account type to get started
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/client-signup")}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up as Client
          </button>

          <button
            onClick={() => router.push("/provider-signup")}
            className="border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            Sign Up as Provider
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/client/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
