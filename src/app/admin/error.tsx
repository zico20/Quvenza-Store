'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-400 text-sm">
          {error.message || 'An unexpected error occurred while loading the admin page.'}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
          >
            Try again
          </button>
          <a
            href="/admin/login"
            className="px-4 py-2 border border-white rounded hover:bg-white/10 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}
