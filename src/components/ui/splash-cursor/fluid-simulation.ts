
// Fluid simulation core functions
import { HSVtoRGB, hexToRgb } from './webgl-utils';
import { 
  CustomProgram, 
  CustomMaterial, 
  FBO, 
  DoubleFBO,
  Program,
  Material,
  compileShader,
  createDoubleFBO,
  createFBO,
  resizeDoubleFBO
} from './fluid-classes';
import { Pointer, correctRadius } from './pointer-handler';
import * as shaders from './shaders';

// SplashConfig interface
export interface SplashConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  CAPTURE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  SHADING: boolean;
  COLOR_UPDATE_SPEED: number;
  PAUSED: boolean;
  BACK_COLOR: { r: number; g: number; b: number };
  TRANSPARENT: boolean;
  useCustomColors: boolean;
  colorPalette: string[];
}

export function initFluidSimulation(
  gl: WebGLRenderingContext,
  ext: any,
  config: SplashConfig
) {
  // Initialize framebuffers, programs, etc.
  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let divergence: FBO;
  let curl: FBO;
  let pressure: DoubleFBO;
  
  // Compile base vertex shader
  const baseVertexShader = compileShader(
    gl,
    gl.VERTEX_SHADER,
    shaders.baseVertexShader
  );

  // Initialize programs
  const copyProgram = new Program(
    gl, 
    baseVertexShader, 
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.copyShader)
  );
  
  const clearProgram = new Program(
    gl, 
    baseVertexShader, 
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.clearShader)
  );
  
  const splatProgram = new Program(
    gl,
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.splatShader)
  );
  
  const advectionProgram = new Program(
    gl,
    baseVertexShader,
    compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      shaders.advectionShader,
      ext.supportLinearFiltering ? [] : ["MANUAL_FILTERING"]
    )
  );
  
  const divergenceProgram = new Program(
    gl, 
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.divergenceShader)
  );
  
  const curlProgram = new Program(
    gl,
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.curlShader)
  );
  
  const vorticityProgram = new Program(
    gl, 
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.vorticityShader)
  );
  
  const pressureProgram = new Program(
    gl,
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.pressureShader)
  );
  
  const gradientSubtractProgram = new Program(
    gl,
    baseVertexShader,
    compileShader(gl, gl.FRAGMENT_SHADER, shaders.gradientSubtractShader)
  );
  
  const displayMaterial = new Material(
    gl,
    baseVertexShader,
    shaders.displayShaderSource
  );
  
  // Setup blit function for rendering
  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()!);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()!);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );
    
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    
    return (target?: FBO | null, clear: boolean = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  })();

  // Initialize framebuffers
  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    
    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    
    gl.disable(gl.BLEND);
    
    if (!dye) {
      dye = createDoubleFBO(
        gl,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering
      );
    } else {
      dye = resizeDoubleFBO(
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
    }
    
    if (!velocity) {
      velocity = createDoubleFBO(
        gl,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering
      );
    } else {
      velocity = resizeDoubleFBO(
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
    }
    
    divergence = createFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    );
    
    curl = createFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    );
    
    pressure = createDoubleFBO(
      gl,
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST
    );
  }
  
  // Update display keywords based on config
  function updateKeywords() {
    let displayKeywords = [];
    if (config.SHADING) displayKeywords.push("SHADING");
    displayMaterial.setKeywords(displayKeywords);
  }
  
  // Get resolution based on device dimensions
  function getResolution(resolution: number) {
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
  
  // Generate color for splats
  function generateColor(colorIndex: number, colorQueue: {r: number, g: number, b: number}[] | null) {
    if (config.useCustomColors && colorQueue && colorQueue.length > 0) {
      return colorQueue[colorIndex];
    }
    
    let c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
  }
  
  // Process a single step of fluid simulation
  function step(dt: number) {
    gl.disable(gl.BLEND);
    
    curlProgram.bind();
    gl.uniform2f(
      curlProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);
    
    vorticityProgram.bind();
    gl.uniform2f(
      vorticityProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();
    
    divergenceProgram.bind();
    gl.uniform2f(
      divergenceProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);
    
    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();
    
    pressureProgram.bind();
    gl.uniform2f(
      pressureProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }
    
    gradientSubtractProgram.bind();
    gl.uniform2f(
      gradientSubtractProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    gl.uniform1i(
      gradientSubtractProgram.uniforms.uPressure,
      pressure.read.attach(0)
    );
    gl.uniform1i(
      gradientSubtractProgram.uniforms.uVelocity,
      velocity.read.attach(1)
    );
    blit(velocity.write);
    velocity.swap();
    
    advectionProgram.bind();
    gl.uniform2f(
      advectionProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY
    );
    
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        velocity.texelSizeX,
        velocity.texelSizeY
      );
    }
    
    let velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.VELOCITY_DISSIPATION
    );
    blit(velocity.write);
    velocity.swap();
    
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        dye.texelSizeX,
        dye.texelSizeY
      );
    }
    
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.DENSITY_DISSIPATION
    );
    blit(dye.write);
    dye.swap();
  }
  
  // Render the fluid simulation
  function render(target: FBO | null) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    
    drawDisplay(target);
  }
  
  // Draw the fluid display
  function drawDisplay(target: FBO | null) {
    let width = target == null ? gl.drawingBufferWidth : target.width;
    let height = target == null ? gl.drawingBufferHeight : target.height;
    
    displayMaterial.bind();
    
    if (config.SHADING) {
      gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    }
    
    gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    blit(target);
  }
  
  // Create splat at the pointer position
  function splat(x: number, y: number, dx: number, dy: number, color: { r: number, g: number, b: number }) {
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
  
  // Create splat at pointer position
  function splatPointer(pointer: Pointer) {
    let dx = pointer.deltaX * config.SPLAT_FORCE;
    let dy = pointer.deltaY * config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }
  
  // Create splash effect on click
  function clickSplat(pointer: Pointer) {
    const color = pointer.color;
    color.r *= 10.0;
    color.g *= 10.0;
    color.b *= 10.0;
    let dx = 10 * (Math.random() - 0.5);
    let dy = 30 * (Math.random() - 0.5);
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
  }

  // Initialize the fluid simulation
  updateKeywords();
  initFramebuffers();

  // Return an object with the necessary functions
  return {
    step,
    render,
    splatPointer,
    clickSplat,
    generateColor,
    updateKeywords,
    initFramebuffers,
  };
}
