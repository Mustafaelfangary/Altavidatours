"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic import with better error handling and loading state
const CleopatraAssistant = dynamic(() => import('./CleopatraAssistant'), { 
  ssr: false,
  loading: () => null // Prevent flash of loading content
});

export default function CleopatraAssistantWrapper() {
  return <CleopatraAssistant />;
}