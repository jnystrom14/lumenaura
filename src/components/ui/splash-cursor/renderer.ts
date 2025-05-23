
// Rendering functions for the fluid simulation

import { FBO, DoubleFBO } from './framebuffer-types';
import { Material } from './classes/material-program';
import { SplashConfig } from './config';

// Render the fluid simulation
export function render(
  gl: WebGLRenderingContext,
  target: FBO | null,
  dye: DoubleFBO,
  displayMaterial: Material,
  config: SplashConfig,
  blit: (target?: FBO | null, clear?: boolean) => void
) {
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  
  drawDisplay(gl, target, dye, displayMaterial, config, blit);
}

// Draw the fluid display
function drawDisplay(
  gl: WebGLRenderingContext,
  target: FBO | null,
  dye: DoubleFBO,
  displayMaterial: Material, 
  config: SplashConfig,
  blit: (target?: FBO | null, clear?: boolean) => void
) {
  let width = target == null ? gl.drawingBufferWidth : target.width;
  let height = target == null ? gl.drawingBufferHeight : target.height;
  
  displayMaterial.bind();
  
  if (config.SHADING) {
    gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
  }
  
  gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
  blit(target);
}
