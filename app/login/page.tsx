"use client";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>
        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-red-500 text-white py-3 rounded mb-4 font-semibold hover:bg-red-600"
        >
          Sign in with Google
        </button>
        <button 
          onClick={() => signIn("credentials", { email: "admin@example.com", password: "123", callbackUrl: "/" })}
          className="w-full bg-gray-800 text-white py-3 rounded font-semibold hover:bg-gray-900"
        >
          Guest Login (Demo)
        </button>
      </div>
    </div>
  );
}