
// Functions for creating splats in the fluid simulation

import { FBO, DoubleFBO } from './framebuffer-types';
import { Program } from './fluid-classes';
import { Pointer, correctRadius } from './pointer-handler';
import { SplashConfig } from './config';
import { HSVtoRGB, hexToRgb } from './webgl-utils';

// Create splat at the pointer position
export function splat(
  gl: WebGLRenderingContext,
  splatProgram: Program,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  x: number, 
  y: number, 
  dx: number, 
  dy: number, 
  color: { r: number, g: number, b: number },
  config: SplashConfig,
  blit: (target?: FBO | null, clear?: boolean) => void
) {
  splatProgram.bind();
  gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
  gl.uniform1f(splatProgram.uniforms.aspectRatio, gl.canvas.width / gl.canvas.height);
  gl.uniform2f(splatProgram.uniforms.point, x, y);
  gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
  gl.uniform1f(
    splatProgram.uniforms.radius,
    correctRadius(config.SPLAT_RADIUS / 100.0, gl.canvas.width, gl.canvas.height)
  );
  blit(velocity.write);
  velocity.swap();

  gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
  gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
  blit(dye.write);
  dye.swap();
}

// Create splat from pointer movement
export function splatPointer(
  gl: WebGLRenderingContext,
  splatProgram: Program,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  pointer: Pointer,
  config: SplashConfig,
  blit: (target?: FBO | null, clear?: boolean) => void
) {
  let dx = pointer.deltaX * config.SPLAT_FORCE;
  let dy = pointer.deltaY * config.SPLAT_FORCE;
  splat(gl, splatProgram, velocity, dye, pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color, config, blit);
}

// Create splash effect on click
export function clickSplat(
  gl: WebGLRenderingContext,
  splatProgram: Program,
  velocity: DoubleFBO,
  dye: DoubleFBO,
  pointer: Pointer,
  config: SplashConfig,
  blit: (target?: FBO | null, clear?: boolean) => void
) {
  const color = { ...pointer.color };
  color.r *= 10.0;
  color.g *= 10.0;
  color.b *= 10.0;
  let dx = 10 * (Math.random() - 0.5);
  let dy = 30 * (Math.random() - 0.5);
  splat(gl, splatProgram, velocity, dye, pointer.texcoordX, pointer.texcoordY, dx, dy, color, config, blit);
}

// Generate color for splats
export function generateColor(
  config: SplashConfig,
  colorIndex: number, 
  colorQueue: {r: number, g: number, b: number}[] | null
) {
  if (config.useCustomColors && colorQueue && colorQueue.length > 0) {
    return colorQueue[colorIndex];
  }
  
  let c = HSVtoRGB(Math.random(), 1.0, 1.0);
  c.r *= 0.15;
  c.g *= 0.15;
  c.b *= 0.15;
  return c;
}
