"use client";

import { useState } from 'react';
import LogoLoader, { LogoSpinner } from '@/components/ui/LogoLoader';

export default function TestLogoLoader() {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [variant, setVariant] = useState<'default' | 'minimal' | 'elegant'>('default');
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  if (showFullScreen) {
    return <LogoLoader variant={variant} size={size} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Logo Loader Test</h1>
          <p className="text-gray-600 text-lg">Testing the unified logo loading experience</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Variant Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variant</label>
              <div className="space-y-2">
                {(['default', 'minimal', 'elegant'] as const).map((v) => (
                  <label key={v} className="flex items-center">
                    <input
                      type="radio"
                      name="variant"
                      value={v}
                      checked={variant === v}
                      onChange={(e) => setVariant(e.target.value as any)}
                      className="mr-2"
                    />
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Controls */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="space-y-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <label key={s} className="flex items-center">
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      checked={size === s}
                      onChange={(e) => setSize(e.target.value as any)}
                      className="mr-2"
                    />
                    {s.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            {/* Full Screen Test */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Screen Test</label>
              <button
                onClick={() => setShowFullScreen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show Full Screen Loader
              </button>
              <p className="text-xs text-gray-500 mt-1">Click anywhere to dismiss</p>
            </div>
          </div>
        </div>

        {/* Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Inline Loaders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Inline Loader</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px]">
              <LogoLoader
                size={size}
                variant={variant}
                fullScreen={false}
              />
            </div>
          </div>

          {/* LogoSpinner */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">LogoSpinner Component</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] flex items-center justify-center">
              <LogoSpinner size={size} />
            </div>
          </div>

          {/* Loading States Demo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Loading States Demo</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Small Inline</h4>
                <LogoSpinner size="sm" />
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Medium Inline</h4>
                <LogoSpinner size="md" />
              </div>
            </div>
          </div>

          {/* With Text */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">With Custom Text</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px]">
              <LogoLoader
                size={size}
                variant={variant}
                fullScreen={false}
                showText={true}
                customText="Please wait..."
              />
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Mobile Preview</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg" style={{ width: '320px', height: '200px', margin: '0 auto' }}>
              <LogoLoader
                size={size}
                variant={variant}
                fullScreen={false}
              />
            </div>
          </div>

          {/* Dark Background */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Dark Background</h3>
            <div className="border-2 border-dashed border-gray-600 rounded-lg min-h-[200px]">
              <LogoLoader
                size={size}
                variant={variant}
                fullScreen={false}
              />
            </div>
          </div>
        </div>

        {/* Navigation Simulation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Navigation Loading Simulation</h3>
          <div className="space-y-4">
            <p className="text-gray-600">
              Navigation loading is automatically handled when you navigate between pages.
              The LogoLoader will appear during route transitions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Home
              </a>
              <a href="/packages" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Packages
              </a>
              <a href="/dahabiyas" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Dahabiyas
              </a>
              <a href="/about" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                About
              </a>
            </div>
            
            <p className="text-sm text-gray-500">
              Click any link above to see the navigation loader in action
            </p>
          </div>
        </div>
      </div>
      
      {/* Overlay handler for full screen */}
      {showFullScreen && (
        <div 
          className="fixed inset-0 z-50 cursor-pointer"
          onClick={() => setShowFullScreen(false)}
        />
      )}
    </div>
  );
}
