"use client";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-pale-green-50 to-pale-blue-50 on-light p-6">
      <div className="max-w-md text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200 p-8">
        <div className="text-5xl mb-4">🏺</div>
        <h1 className="text-2xl font-bold text-amber-800 mb-2">You are offline</h1>
        <p className="text-gray-700 mb-6">
          Some content may be unavailable. Please check your internet connection and try again.
        </p>
        <button
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold focus-emerald-ring"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
