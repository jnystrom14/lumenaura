
// Fluid simulation core initialization function
import { Material, Program, compileShader } from './fluid-classes';
import * as shaders from './shaders';
import { SplashConfig } from './config';
import { simulationStep } from './simulation-step';
import { render } from './renderer';
import { splatPointer, clickSplat, generateColor } from './splat-creator';
import { initFramebuffers } from './framebuffer-manager';
import { Pointer } from './pointer-handler';
import { FBO, DoubleFBO } from './framebuffer-types';

export function initFluidSimulation(
  gl: WebGLRenderingContext,
  ext: any,
  config: SplashConfig
) {
  // Variables for framebuffers
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

  // Update display keywords based on config
  const updateKeywords = () => {
    let displayKeywords = [];
    if (config.SHADING) displayKeywords.push("SHADING");
    displayMaterial.setKeywords(displayKeywords);
  };
  
  // Initialize the framebuffers
  const initializeFramebuffers = () => {
    const result = initFramebuffers(gl, ext, config, copyProgram, dye, velocity, blit);
    dye = result.dye;
    velocity = result.velocity;
    divergence = result.divergence;
    curl = result.curl;
    pressure = result.pressure;
  };

  // Step function
  const step = (dt: number) => {
    simulationStep(
      gl,
      config,
      dt,
      curlProgram,
      vorticityProgram,
      divergenceProgram,
      clearProgram,
      pressureProgram,
      gradientSubtractProgram,
      advectionProgram,
      curl,
      velocity,
      divergence,
      pressure,
      dye,
      ext,
      blit
    );
  };

  // Splat pointer function
  const handleSplatPointer = (pointer: Pointer) => {
    splatPointer(gl, splatProgram, velocity, dye, pointer, config, blit);
  };

  // Click splat function
  const handleClickSplat = (pointer: Pointer) => {
    clickSplat(gl, splatProgram, velocity, dye, pointer, config, blit);
  };

  // Generate color function
  const handleGenerateColor = (colorIndex: number, colorQueue: {r: number, g: number, b: number}[] | null) => {
    return generateColor(config, colorIndex, colorQueue);
  };

  // Render function
  const renderDisplay = (target: FBO | null) => {
    render(gl, target, dye, displayMaterial, config, blit);
  };

  // Initialize the fluid simulation
  updateKeywords();
  initializeFramebuffers();

  // Return an object with the necessary functions
  return {
    step,
    render: renderDisplay,
    splatPointer: handleSplatPointer,
    clickSplat: handleClickSplat,
    generateColor: handleGenerateColor,
    updateKeywords,
    initFramebuffers: initializeFramebuffers,
  };
}
