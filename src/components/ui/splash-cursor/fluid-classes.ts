
// Re-exporting from the refactored files
export { 
  Material, 
  Program, 
  CustomMaterial, 
  CustomProgram,
  hashCode
} from './classes/material-program';

export {
  createProgram,
  getUniforms,
  compileShader
} from './utils/shader-utils';

export {
  createFBO,
  createDoubleFBO,
  resizeFBO,
  resizeDoubleFBO
} from './utils/framebuffer-utils';
