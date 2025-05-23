
"use client";
import { useEffect, useRef, useState } from "react";
import { scaleByPixelRatio, wrap, hexToRgb } from "./webgl-utils";
import { createPointer, updatePointerDownData, updatePointerMoveData, updatePointerUpData } from "./pointer-handler";
import { getWebGLContext } from "./webgl-utils";
import { initFluidSimulation } from "./fluid-simulation";

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
  useCustomColors?: boolean;
  colorPalette?: string[];
}

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1024, // Reduced from 1440 for better performance
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 4.0, // Increased for faster fade-out
  VELOCITY_DISSIPATION = 2.5,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 }, // Transparent black background
  TRANSPARENT = true,
  useCustomColors = true,
  colorPalette = ["#9b87f5", "#FFDEE2", "#E5DEFF", "#FEF7CD", "#D3E4FD"],
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointer = createPointer();
    const pointers = [pointer];

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
      useCustomColors,
      colorPalette
    };

    // Initialize WebGL context
    const { gl, ext } = getWebGLContext(canvas);

    // Handle unsupported features
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    // Initialize fluid simulation
    const fluidSim = initFluidSimulation(gl, ext, config);

    // Convert color palette to RGB values
    const colorQueue = config.useCustomColors 
      ? config.colorPalette.map(hexToRgb)
      : null;
    
    // Setup animation loop
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;
    let colorIndex = 0;
    let animationFrameId: number;

    // Update frame function
    function updateFrame() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) fluidSim.initFramebuffers();
      updateColors(dt);
      applyInputs();
      if (!config.PAUSED) fluidSim.step(dt);
      fluidSim.render(null);
      animationFrameId = requestAnimationFrame(updateFrame);
    }

    // Calculate delta time between frames
    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666); // Cap at ~60fps
      lastUpdateTime = now;
      return dt;
    }

    // Resize canvas to match display size
    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    // Update colors for pointers
    function updateColors(dt: number) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          p.color = fluidSim.generateColor(colorIndex, colorQueue);
          colorIndex = (colorIndex + 1) % (colorQueue?.length || 1);
        });
      }
    }

    // Apply inputs from pointers
    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          fluidSim.splatPointer(p);
        }
      });
    }

    // Event handlers
    window.addEventListener("mousedown", (e) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY, canvas.width, canvas.height);
      fluidSim.clickSplat(pointer);
    });

    const handleFirstMouseMove = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updateFrame(); // Start animation loop
      updatePointerMoveData(
        pointer, 
        posX, 
        posY, 
        fluidSim.generateColor(colorIndex, colorQueue),
        canvas.width,
        canvas.height
      );
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
    };

    document.body.addEventListener("mousemove", handleFirstMouseMove);

    window.addEventListener("mousemove", (e) => {
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerMoveData(
        pointer, 
        posX, 
        posY, 
        pointer.color,
        canvas.width,
        canvas.height
      );
    });

    const handleFirstTouchStart = (e: TouchEvent) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updateFrame(); // Start animation loop
        updatePointerDownData(
          pointer, 
          touches[i].identifier, 
          posX, 
          posY,
          canvas.width,
          canvas.height
        );
      }
      document.body.removeEventListener("touchstart", handleFirstTouchStart);
    };

    document.body.addEventListener("touchstart", handleFirstTouchStart);

    window.addEventListener("touchstart", (e) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerDownData(
          pointer, 
          touches[i].identifier, 
          posX, 
          posY,
          canvas.width,
          canvas.height
        );
      }
    });

    window.addEventListener("touchmove", (e) => {
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerMoveData(
          pointer, 
          posX, 
          posY, 
          pointer.color,
          canvas.width,
          canvas.height
        );
      }
    }, false);

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    });

    // Start animation
    updateFrame();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      // Remove event listeners
      window.removeEventListener("mousedown", () => {});
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("touchstart", () => {});
      window.removeEventListener("touchmove", () => {});
      window.removeEventListener("touchend", () => {});
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
    useCustomColors,
    colorPalette,
  ]);

  return (
    <div className="fixed top-0 left-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} id="fluid" className="w-screen h-screen" />
    </div>
  );
}

export { SplashCursor };
