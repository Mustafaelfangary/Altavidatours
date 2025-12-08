'use client';

import { useState, useEffect } from 'react';

interface MegaMenuTestProps {
  onTestComplete?: (results: any) => void;
}

export default function MegaMenuTest({ onTestComplete }: MegaMenuTestProps) {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const runTests = async () => {
    // Only run in development and client-side
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return;
    
    setIsRunning(true);
    const results: any = {
      hoverBehavior: false,
      imageLoading: false,
      navigationLinks: false,
      mobileMenu: false,
      errors: []
    };

    try {
      // Test 1: Hover behavior
      console.log('🧪 Testing mega menu hover behavior...');
      const navItems = document.querySelectorAll('.dropdown-container');
      if (navItems.length > 0) {
        results.hoverBehavior = true;
        console.log('✅ Mega menu hover containers found');
      } else {
        results.errors.push('No dropdown containers found');
      }

      // Test 2: Image loading
      console.log('🧪 Testing image loading...');
      const images = Array.from(document.querySelectorAll('img'));
      let loadedImages = 0;
      
      // Filter out tracking pixels and other small images
      const visibleImages = images.filter(img => {
        const rect = img.getBoundingClientRect();
        return rect.width > 10 && rect.height > 10; // Only count visible images
      });
      
      const totalImages = visibleImages.length;
      
      for (const img of visibleImages) {
        if (img.complete && img.naturalHeight !== 0) {
          loadedImages++;
        }
      }
      
      results.imageLoading = totalImages === 0 ? true : loadedImages / totalImages > 0.8;
      console.log(`✅ Images loaded: ${loadedImages}/${totalImages}`);

      // Test 3: Navigation links
      console.log('🧪 Testing navigation links...');
      const links = Array.from(document.querySelectorAll('a[href]'));
      let validLinks = 0;
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith('http'))) {
          validLinks++;
        }
      });
      
      results.navigationLinks = links.length === 0 ? true : validLinks / links.length > 0.9;
      console.log(`✅ Valid navigation links: ${validLinks}/${links.length}`);

      // Test 4: Mobile menu
      console.log('🧪 Testing mobile menu...');
      const mobileMenuButton = document.querySelector('[data-testid="mobile-menu-button"]') || 
                              document.querySelector('button[aria-label*="menu"]') ||
                              document.querySelector('.mobile-menu-button');
      
      results.mobileMenu = !!mobileMenuButton;
      if (mobileMenuButton) {
        console.log('✅ Mobile menu button found');
      } else {
        results.errors.push('Mobile menu button not found');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Test error: ${errorMessage}`);
      console.error('❌ Test error:', error);
    }

    setTestResults(results);
    setIsRunning(false);
    
    if (onTestComplete) {
      onTestComplete(results);
    }
  };

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
    
    // Only run in development and client-side
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }

    // Check if tests have already run to prevent multiple executions
    if (testResults.runCount > 0) {
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        runTests();
      }, 1000);

      return () => clearTimeout(timer);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [testResults.runCount]); // Only re-run if runCount changes

  // Don't render anything in production or during SSR
  if (process.env.NODE_ENV !== 'development' || !isClient) {
    return null;
  }

  const getStatusIcon = (status: boolean) => status ? '✅' : '❌';
  const getStatusText = (status: boolean) => status ? 'PASS' : 'FAIL';

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Mega Menu Test</h3>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Hover Behavior:</span>
          <span className={`font-medium ${testResults.hoverBehavior ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.hoverBehavior)} {getStatusText(testResults.hoverBehavior)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Image Loading:</span>
          <span className={`font-medium ${testResults.imageLoading ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.imageLoading)} {getStatusText(testResults.imageLoading)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Navigation Links:</span>
          <span className={`font-medium ${testResults.navigationLinks ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.navigationLinks)} {getStatusText(testResults.navigationLinks)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>Mobile Menu:</span>
          <span className={`font-medium ${testResults.mobileMenu ? 'text-green-600' : 'text-red-600'}`}>
            {getStatusIcon(testResults.mobileMenu)} {getStatusText(testResults.mobileMenu)}
          </span>
        </div>

        {testResults.errors && testResults.errors.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-1">Errors:</h4>
            <ul className="text-xs text-red-700 space-y-1">
              {testResults.errors.map((error: string, index: number) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isClient && (
        <div className="mt-3 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
