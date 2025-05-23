
import React, { useRef, useEffect } from 'react';
import { initFluidSimulation } from './fluid-simulation';
import { createPointer, updatePointerDownData, updatePointerMoveData, updatePointerUpData } from './pointer-handler';
import { getWebGLContext } from './webgl-utils';
import { defaultConfig } from './config';

export interface SplashCursorProps {
  className?: string;
  colorPalette?: string[];
}

export function SplashCursor({ className = '', colorPalette }: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = useRef({ ...defaultConfig });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Override color palette if provided
    if (colorPalette && Array.isArray(colorPalette) && colorPalette.length > 0) {
      config.current.useCustomColors = true;
      config.current.colorPalette = colorPalette;
    }

    // Get WebGL context and extension
    const canvas = canvasRef.current;
    const glResult = getWebGLContext(canvas);
    const gl = glResult.gl as WebGLRenderingContext;
    const ext = glResult.ext;
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Initialize variables
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0;
    let pointers = [createPointer()];
    let animationFrameId: number;
    let currentColorIndex = 0;
    
    let colorQueue: { r: number, g: number, b: number }[] = [];
    if (config.current.useCustomColors) {
      config.current.colorPalette.forEach(color => {
        colorQueue.push({ r: parseInt(color.slice(1, 3), 16) / 255, 
                        g: parseInt(color.slice(3, 5), 16) / 255, 
                        b: parseInt(color.slice(5, 7), 16) / 255 });
      });
    }
    
    // Initialize fluid simulation
    const fluidSim = initFluidSimulation(gl, ext, config.current);

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      fluidSim.initFramebuffers();
    };

    // Animation loop
    const update = () => {
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 0.016);
      lastUpdateTime = now;

      if (colorUpdateTimer >= config.current.COLOR_UPDATE_SPEED && pointers[0].moved) {
        let colorIndex = currentColorIndex % colorQueue.length;
        pointers[0].color = fluidSim.generateColor(colorIndex, colorQueue.length > 0 ? colorQueue : null);
        currentColorIndex++;
        colorUpdateTimer = 0;
      }
      colorUpdateTimer++;

      fluidSim.step(dt);
      fluidSim.render(null);
      animationFrameId = requestAnimationFrame(update);
    };

    // Handle pointer events
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      let posX = e.offsetX;
      let posY = e.offsetY;
      updatePointerDownData(pointers[0], e.pointerId, posX, posY, canvas.width, canvas.height);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!pointers[0].down) return;
      let posX = e.offsetX;
      let posY = e.offsetY;
      
      // Use color from queue if available, otherwise generate a random one
      const colorIndex = currentColorIndex % (colorQueue.length || 1);
      const color = colorQueue.length > 0 ? colorQueue[colorIndex] : fluidSim.generateColor(0, null);
      
      updatePointerMoveData(pointers[0], posX, posY, color, canvas.width, canvas.height);
      fluidSim.splatPointer(pointers[0]);
    };

    const handlePointerUp = (e: PointerEvent) => {
      updatePointerUpData(pointers[0]);
    };

    // Initialize and start the simulation
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    
    update();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
    };
  }, [colorPalette]);

  return (
    <canvas
      ref={canvasRef}
      className={`fluid-canvas ${className}`}
      style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}
    />
  );
}
