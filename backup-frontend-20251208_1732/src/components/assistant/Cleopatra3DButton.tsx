"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { MessageSquare } from 'lucide-react';
import * as THREE from 'three';

interface Cleopatra3DModelProps {
  onClick?: () => void;
}

// 3D Model Component
function CleopatraModel({ onClick }: Cleopatra3DModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load Cleopatra 3D model from public/images folder
  const { scene } = useGLTF('/images/cleopatra_-_egyptian_queen.glb');
  
  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      // Floating up and down
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      // Gentle rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.8} position={[0, -0.2, 0]} />
    </group>
  );
}

// Fallback Loading Component
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    </Html>
  );
}

// Main 3D Button Component
interface Cleopatra3DButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function Cleopatra3DButton({ onClick, isOpen }: Cleopatra3DButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${
        isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      }`}
      aria-label="Open Cleopatra AI Assistant"
    >
      {/* 3D Canvas Container - Unified size for mobile with transparent background */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-2xl bg-transparent hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
          
          {/* 3D Model */}
          <Suspense fallback={<LoadingFallback />}>
            <CleopatraModel />
          </Suspense>
          
          {/* Disable OrbitControls for button behavior */}
        </Canvas>
        
        {/* Pulse Ring Animation */}
        <div className="absolute inset-0 rounded-full border-2 sm:border-3 border-blue-400 animate-ping opacity-20"></div>
        
        {/* Badge/Notification Dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
      </div>
      
      {/* Tooltip - Hidden on mobile */}
      <div className="hidden sm:block absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        Ask Cleopatra AI
      </div>
    </button>
  );
}

// Fallback 2D Button (if 3D fails to load) - Unified style
export function Cleopatra2DButton({ onClick, isOpen }: Cleopatra3DButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      }`}
      aria-label="Open Cleopatra Assistant"
    >
      <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
      <div className="absolute inset-0 rounded-full border-2 sm:border-3 border-blue-400 animate-ping opacity-20"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
    </button>
  );
}

// Preload the model
useGLTF.preload('/images/cleopatra_-_egyptian_queen.glb');
