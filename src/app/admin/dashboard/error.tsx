'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-red-950/30 border border-red-900 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-100 mb-2">
          Dashboard failed to load
        </h2>
        <p className="text-red-300 text-sm mb-4">
          {error.message || 'Unknown error'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
        >
          Reload Dashboard
        </button>
      </div>
    </div>
  );
}
