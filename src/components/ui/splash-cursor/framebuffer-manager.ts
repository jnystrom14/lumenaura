
// Framebuffer management for fluid simulation

import { FBO, DoubleFBO } from './framebuffer-types';
import { SplashConfig } from './config';
import { createDoubleFBO, createFBO, resizeDoubleFBO, Program } from './fluid-classes';

// Initialize framebuffers
export function initFramebuffers(
  gl: WebGLRenderingContext,
  ext: any,
  config: SplashConfig,
  copyProgram: Program,
  dye?: DoubleFBO,
  velocity?: DoubleFBO,
  blit?: (target?: FBO | null, clear?: boolean) => void
) {
  const simRes = getResolution(gl, config.SIM_RESOLUTION);
  const dyeRes = getResolution(gl, config.DYE_RESOLUTION);
  
  const texType = ext.halfFloatTexType;
  const rgba = ext.formatRGBA;
  const rg = ext.formatRG;
  const r = ext.formatR;
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
  
  gl.disable(gl.BLEND);
  
  let newDye: DoubleFBO;
  if (!dye) {
    newDye = createDoubleFBO(
      gl,
      dyeRes.width,
      dyeRes.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering
    );
  } else if (blit) {
    newDye = resizeDoubleFBO(
      gl,
      copyProgram,
      dye,
      dyeRes.width,
      dyeRes.height,
      rgba.internalFormat,
      rgba.format,
      texType,
      filtering,
      blit
    );
  } else {
    throw new Error("Blit function is required when resizing framebuffers");
  }
  
  let newVelocity: DoubleFBO;
  if (!velocity) {
    newVelocity = createDoubleFBO(
      gl,
      simRes.width,
      simRes.height,
      rg.internalFormat,
      rg.format,
      texType,
      filtering
    );
  } else if (blit) {
    newVelocity = resizeDoubleFBO(
      gl,
      copyProgram,
      velocity,
      simRes.width,
      simRes.height,
      rg.internalFormat,
      rg.format,
      texType,
      filtering,
      blit
    );
  } else {
    throw new Error("Blit function is required when resizing framebuffers");
  }
  
  const divergence = createFBO(
    gl,
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );
  
  const curl = createFBO(
    gl,
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );
  
  const pressure = createDoubleFBO(
    gl,
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  );

  return {
    dye: newDye,
    velocity: newVelocity,
    divergence,
    curl,
    pressure
  };
}

// Get resolution based on device dimensions
function getResolution(
  gl: WebGLRenderingContext, 
  resolution: number
) {
  const aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspectRatio < 1) {
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    return { width: max, height: min };
  } else {
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    return { width: max, height: min };
  }
}
