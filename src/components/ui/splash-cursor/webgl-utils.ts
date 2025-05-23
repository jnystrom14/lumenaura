
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
  let halfFloatTexType = gl.HALF_FLOAT_OES;
  if (!halfFloat) {
    console.error("OES_texture_half_float not supported");
    halfFloatTexType = gl.UNSIGNED_BYTE;
  }
  
  // Additional extensions
  gl.getExtension("EXT_color_buffer_float");
  gl.getExtension("OES_standard_derivatives");

  // Format objects
  const formatRGBA = getSupportedFormat(
    gl,
    gl.RGBA16F || 34842,  // Use constant if not available
    gl.RGBA,
    halfFloatTexType
  );
  
  const formatRG = getSupportedFormat(
    gl,
    gl.RG16F || 33327,    // Use constant if not available
    gl.RG || 33319,       // Use constant if not available
    halfFloatTexType
  );
  
  const formatR = getSupportedFormat(
    gl,
    gl.R16F || 33325,     // Use constant if not available
    gl.RED || 6403,       // Use constant if not available
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
    (internalFormat === gl.R16F || internalFormat === 33325 ||
     internalFormat === gl.RG16F || internalFormat === 33327 ||
     internalFormat === gl.RGBA16F || internalFormat === 34842)
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
