
// Pointer handling for splash cursor

// Pointer interface
export interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: { r: number; g: number; b: number };
}

// Create new pointer
export function createPointer(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 }
  };
}

// Update pointer down data
export function updatePointerDownData(
  pointer: Pointer,
  id: number,
  posX: number,
  posY: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  pointer.id = id;
  pointer.down = true;
  pointer.moved = false;
  pointer.texcoordX = posX / canvasWidth;
  pointer.texcoordY = 1.0 - posY / canvasHeight;
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.deltaX = 0;
  pointer.deltaY = 0;
}

// Update pointer move data
export function updatePointerMoveData(
  pointer: Pointer,
  posX: number,
  posY: number,
  color: { r: number; g: number; b: number },
  canvasWidth: number,
  canvasHeight: number
): void {
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.texcoordX = posX / canvasWidth;
  pointer.texcoordY = 1.0 - posY / canvasHeight;
  pointer.deltaX = correctDeltaX(
    pointer.texcoordX - pointer.prevTexcoordX,
    canvasWidth,
    canvasHeight
  );
  pointer.deltaY = correctDeltaY(
    pointer.texcoordY - pointer.prevTexcoordY,
    canvasWidth,
    canvasHeight
  );
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  pointer.color = color;
}

// Update pointer up data
export function updatePointerUpData(pointer: Pointer): void {
  pointer.down = false;
}

// Correct delta X for aspect ratio
function correctDeltaX(
  delta: number,
  canvasWidth: number,
  canvasHeight: number
): number {
  const aspectRatio = canvasWidth / canvasHeight;
  if (aspectRatio < 1) delta *= aspectRatio;
  return delta;
}

// Correct delta Y for aspect ratio
function correctDeltaY(
  delta: number,
  canvasWidth: number,
  canvasHeight: number
): number {
  const aspectRatio = canvasWidth / canvasHeight;
  if (aspectRatio > 1) delta /= aspectRatio;
  return delta;
}

// Correct splat radius for aspect ratio
export function correctRadius(
  radius: number,
  canvasWidth: number,
  canvasHeight: number
): number {
  let aspectRatio = canvasWidth / canvasHeight;
  if (aspectRatio > 1) radius *= aspectRatio;
  return radius;
}
