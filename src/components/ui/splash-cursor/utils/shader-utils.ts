
// Helper function to create WebGL program
export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.trace(gl.getProgramInfoLog(program));

  return program;
}

// Helper function to get uniforms
export function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  const uniforms: Record<string, WebGLUniformLocation> = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  
  for (let i = 0; i < uniformCount; i++) {
    const uniformName = gl.getActiveUniform(program, i)!.name;
    uniforms[uniformName] = gl.getUniformLocation(program, uniformName)!;
  }
  
  return uniforms;
}

// Helper function to compile shader
export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
  keywords: string[] = []
): WebGLShader {
  source = addKeywords(source, keywords);
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    console.trace(gl.getShaderInfoLog(shader));

  return shader;
}

// Helper function to add keywords to shader
function addKeywords(source: string, keywords: string[] = []): string {
  if (!keywords.length) return source;
  
  let keywordsString = "";
  keywords.forEach((keyword) => {
    keywordsString += "#define " + keyword + "\n";
  });
  
  return keywordsString + source;
}
