
// WebGL utility functions for splash cursor

/**
 * Get WebGL context from a canvas element
 */
export function getWebGLContext(canvas: HTMLCanvasElement) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };
  
  let gl = canvas.getContext("webgl2", params);
  const isWebGL2 = !!gl;
  
  if (!isWebGL2) {
    gl = canvas.getContext("webgl", params) || 
         canvas.getContext("experimental-webgl", params) as WebGLRenderingContext;
  }
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  const halfFloat = isWebGL2 ? null : gl.getExtension("OES_texture_half_float");
  const halfFloatTexType = isWebGL2
    ? gl.HALF_FLOAT
    : halfFloat?.HALF_FLOAT_OES;
    
  const supportLinearFiltering = isWebGL2
    ? gl.getExtension("OES_texture_float_linear")
    : gl.getExtension("OES_texture_half_float_linear");
  
  // Format initialization
  let formatRGBA, formatRG, formatR;

  if (isWebGL2) {
    formatRGBA = getSupportedFormat(
      gl,
      gl.RGBA16F,
      gl.RGBA,
      halfFloatTexType
    );
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  };
}

/**
 * Get supported format for WebGL
 */
export function getSupportedFormat(
  gl: WebGLRenderingContext, 
  internalFormat: number, 
  format: number, 
  type: number
) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
      default:
        return null;
    }
  }
  
  return {
    internalFormat,
    format,
  };
}

/**
 * Check if render texture format is supported
 */
export function supportRenderTextureFormat(
  gl: WebGLRenderingContext, 
  internalFormat: number, 
  format: number, 
  type: number
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    internalFormat,
    4,
    4,
    0,
    format,
    type,
    null
  );

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  return status === gl.FRAMEBUFFER_COMPLETE;
}

/**
 * Helper to hash shader keywords
 */
export function hashCode(s: string): number {
  if (s.length === 0) return 0;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Scale by device pixel ratio
 */
export function scaleByPixelRatio(input: number): number {
  const pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

/**
 * Get resolution based on aspect ratio
 */
export function getResolution(resolution: number, width: number, height: number) {
  let aspectRatio = width / height;
  if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
  const min = Math.round(resolution);
  const max = Math.round(resolution * aspectRatio);
  if (width > height)
    return { width: max, height: min };
  else 
    return { width: min, height: max };
}

/**
 * Utility to wrap values within a range
 */
export function wrap(value: number, min: number, max: number) {
  const range = max - min;
  if (range === 0) return min;
  return ((value - min) % range) + min;
}

/**
 * Convert HSV color to RGB
 */
export function HSVtoRGB(h: number, s: number, v: number) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }
  
  return { r, g, b };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}
