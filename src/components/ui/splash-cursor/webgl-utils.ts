
// WebGL utility functions

// Hash function for shader keywords
export function hashCode(s: string): number {
  if (s.length === 0) return 0;
  
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  return hash;
}

// HSV to RGB color conversion
export function HSVtoRGB(h: number, s: number, v: number): { r: number, g: number, b: number } {
  let r = 0, g = 0, b = 0;
  
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
  }
  
  return { r, g, b };
}

// Hex to RGB color conversion
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  
  return { r, g, b };
}

// Get WebGL context with necessary extensions
export function getWebGLContext(canvas: HTMLCanvasElement) {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  let gl = canvas.getContext("webgl", params) as WebGLRenderingContext;
  
  if (!gl) {
    gl = canvas.getContext("experimental-webgl", params) as WebGLRenderingContext;
  }
  
  if (!gl) {
    console.error("WebGL not supported");
    return { gl: null, ext: null };
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // Extensions setup
  const halfFloat = gl.getExtension("OES_texture_half_float");
  const supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
  
  // Format setup
  let halfFloatTexType = halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
  if (!halfFloat) {
    console.error("OES_texture_half_float not supported");
  }
  
  // Additional extensions
  gl.getExtension("EXT_color_buffer_float");
  gl.getExtension("OES_standard_derivatives");

  // Format objects - using constants for WebGL extensions that might not be in the type definitions
  const formatRGBA = getSupportedFormat(
    gl,
    34842, // gl.RGBA16F - Using constant since TypeScript doesn't recognize this
    gl.RGBA,
    halfFloatTexType
  );
  
  const formatRG = getSupportedFormat(
    gl,
    33327, // gl.RG16F - Using constant since TypeScript doesn't recognize this
    33319, // gl.RG - Using constant since TypeScript doesn't recognize this
    halfFloatTexType
  );
  
  const formatR = getSupportedFormat(
    gl,
    33325, // gl.R16F - Using constant since TypeScript doesn't recognize this
    6403,  // gl.RED - Using constant since TypeScript doesn't recognize this
    halfFloatTexType
  );

  // Fallback formats
  const fallbackFormatRGBA = getSupportedFormat(
    gl,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE
  );
  
  const fallbackFormatRG = getSupportedFormat(
    gl,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE
  );
  
  const fallbackFormatR = getSupportedFormat(
    gl,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE
  );

  // WebGL extensions object
  return {
    gl,
    ext: {
      supportLinearFiltering,
      halfFloatTexType,
      formatRGBA: formatRGBA || fallbackFormatRGBA,
      formatRG: formatRG || fallbackFormatRG,
      formatR: formatR || fallbackFormatR,
    },
  };
}

// Interface for format support
interface FormatSupport {
  internalFormat: number;
  format: number;
}

// Get supported format
function getSupportedFormat(
  gl: WebGLRenderingContext, 
  internalFormat: number, 
  format: number,
  type: number
): FormatSupport | null {
  // WebGL 1.0 has limitations on format support
  // This is a simplified version to avoid errors
  if (
    !isFormatSupported(gl, internalFormat, format, type) &&
    (internalFormat === 33325 || // gl.R16F
     internalFormat === 33327 || // gl.RG16F
     internalFormat === 34842)   // gl.RGBA16F
  ) {
    // Fallback to standard formats
    return null;
  }
  
  return { internalFormat, format };
}

// Check if a format is supported
function isFormatSupported(
  gl: WebGLRenderingContext, 
  internalFormat: number, 
  format: number,
  type: number
): boolean {
  // Create a small texture with the format
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
  
  // Create FBO and attach the texture
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  
  // Check if the format is supported
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  
  // Clean up
  gl.deleteTexture(texture);
  gl.deleteFramebuffer(fbo);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return status === gl.FRAMEBUFFER_COMPLETE;
}
