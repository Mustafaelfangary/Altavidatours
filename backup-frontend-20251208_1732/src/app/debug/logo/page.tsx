'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoInfo {
  logoUrl: string;
  key: string;
  timestamp: number;
  error?: string;
}

export default function LogoDebugPage() {
  const [logoInfo, setLogoInfo] = useState<LogoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/logo', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogoInfo(data);
        console.log('Logo data:', data);
      } else {
        const errorText = await response.text();
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Logo Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Logo Status</h2>
            <button
              onClick={fetchLogo}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {loading && (
            <div className="text-gray-600">Loading logo information...</div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {logoInfo && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Logo Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{logoInfo.logoUrl}</code></div>
                    <div><strong>Key:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{logoInfo.key}</code></div>
                    <div><strong>Timestamp:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{new Date(logoInfo.timestamp).toLocaleString()}</code></div>
                    {logoInfo.error && (
                      <div><strong>API Error:</strong> <span className="text-red-600">{logoInfo.error}</span></div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Logo Preview</h3>
                  <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                    <Image
                      src={`${logoInfo.logoUrl}?t=${logoInfo.timestamp}`}
                      alt="Logo"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                      unoptimized={true}
                      onError={() => {
                        console.error('Logo failed to load:', logoInfo.logoUrl);
                      }}
                      onLoad={() => {
                        console.log('Logo loaded successfully:', logoInfo.logoUrl);
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold mb-2">Test Results</h3>
                <div className="space-y-1 text-sm">
                  <div>✅ API endpoint working</div>
                  <div>✅ Logo URL retrieved: {logoInfo.logoUrl}</div>
                  <div>✅ Cache busting applied</div>
                  <div>{logoInfo.key === 'default' ? '⚠️' : '✅'} Database logo {logoInfo.key === 'default' ? 'not found, using fallback' : 'found'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <div className="space-y-2 text-sm">
            <div><strong>1.</strong> Check if the development server is running</div>
            <div><strong>2.</strong> Verify that <code>/images/logo.png</code> exists in the public directory</div>
            <div><strong>3.</strong> Check browser console for additional errors</div>
            <div><strong>4.</strong> Make sure the database contains logo entries</div>
            <div><strong>5.</strong> Try clearing browser cache (Ctrl+F5)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
