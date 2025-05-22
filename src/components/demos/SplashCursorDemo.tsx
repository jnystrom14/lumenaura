
import React from 'react';
import { SplashCursor } from '@/components/ui/splash-cursor';
import { Button } from '@/components/ui/button';

export function SplashCursorDemo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* SplashCursor with z-index 0 will be behind all content */}
      <SplashCursor 
        DENSITY_DISSIPATION={4.0}
        DYE_RESOLUTION={1024}
        SPLAT_FORCE={4000}
        colorPalette={["#9b87f5", "#FFDEE2", "#E5DEFF", "#FEF7CD", "#D3E4FD"]}
      />
      
      <div className="z-10 relative bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-purple-700">SplashCursor Demo</h1>
        <p className="text-gray-700">
          Move your mouse around to create beautiful fluid animations.
          Click anywhere to create a splash effect.
        </p>
        <div className="flex space-x-3 justify-center">
          <Button variant="default">
            Interactive Button
          </Button>
          <Button variant="outline">
            Another Button
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-10">
          This interactive fluid simulation creates a beautiful, subtle background effect
          that responds to user movement.
        </p>
      </div>
    </div>
  );
}
