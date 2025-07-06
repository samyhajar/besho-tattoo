"use client";

import { useState } from 'react';
import { cleanupPastAvailabilitySlots } from '@/services/logs';

export default function CleanupButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCleanup = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setResult(null);

      const deletedCount = await cleanupPastAvailabilitySlots();

      if (deletedCount > 0) {
        setResult(`✅ Cleaned up ${deletedCount} past availability slot${deletedCount === 1 ? '' : 's'}`);
      } else {
        setResult('ℹ️ No past availability slots found to clean up');
      }

      // Clear the result after 5 seconds
      setTimeout(() => setResult(null), 5000);
    } catch (error) {
      console.error('Error cleaning up slots:', error);
      setResult('❌ Failed to clean up past slots');
      setTimeout(() => setResult(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={() => void handleCleanup()}
        disabled={isLoading}
        className={`
          px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
          ${isLoading
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-500 text-white hover:scale-105'
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cleaning...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clean Past Slots
          </>
        )}
      </button>

      {result && (
        <div className={`
          text-sm px-3 py-1 rounded-lg max-w-sm text-right
          ${result.includes('✅') ? 'bg-green-900/20 text-green-400 border border-green-700/50' :
            result.includes('❌') ? 'bg-red-900/20 text-red-400 border border-red-700/50' :
            'bg-blue-900/20 text-blue-400 border border-blue-700/50'}
        `}>
          {result}
        </div>
      )}
    </div>
  );
}