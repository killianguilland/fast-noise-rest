import FastNoiseLite from "fastnoise-lite";

/*
Detect FastNoiseLite setters and enums
*/
export const setters = Object.getOwnPropertyNames(FastNoiseLite.prototype)
  .filter(n => n.startsWith("Set"));

export const enums = {
  NoiseType: Object.keys((FastNoiseLite as any).NoiseType || {}),
  RotationType3D: Object.keys((FastNoiseLite as any).RotationType3D || {}),
  FractalType: Object.keys((FastNoiseLite as any).FractalType || {}),
  CellularDistanceFunction: Object.keys((FastNoiseLite as any).CellularDistanceFunction || {}),
  CellularReturnType: Object.keys((FastNoiseLite as any).CellularReturnType || {}),
  DomainWarpType: Object.keys((FastNoiseLite as any).DomainWarpType || {}),
};

export const parameters = setters.map(s => {
  const originalName = s.replace("Set", "");
  const camelName = originalName.charAt(0).toLowerCase() + originalName.slice(1);
  const possibleValues = (enums as any)[originalName];

  return {
    name: camelName,
    originalName,
    type: possibleValues ? "string" : "number",
    enumValues: possibleValues
  };
});

/*
Apply parameters dynamically
*/
export function applyParams(noise: FastNoiseLite, params: Record<string, any>) {
  for (const [key, value] of Object.entries(params)) {
    const setter = "Set" + key.charAt(0).toUpperCase() + key.slice(1);
    if (setters.includes(setter)) {
      const num = Number(value);
      // @ts-ignore
      noise[setter as keyof FastNoiseLite](isNaN(num) ? value : num);
    }
  }
}

export function buildNoise(params: Record<string, any>) {
  const noise = new FastNoiseLite();
  applyParams(noise, params);
  return noise;
}

export function generateGrid(
  noise: FastNoiseLite,
  w: number,
  h: number,
  s: number,
  startX: number,
  startY: number,
  zCoord?: number
): number[][] {
  const grid: number[][] = [];
  for (let iy = 0; iy < h; iy++) {
    const row: number[] = [];
    for (let ix = 0; ix < w; ix++) {
      if (zCoord !== undefined) {
        row.push(noise.GetNoise(startX + ix * s, startY + iy * s, zCoord));
      } else {
        row.push(noise.GetNoise(startX + ix * s, startY + iy * s));
      }
    }
    grid.push(row);
  }
  return grid;
}

export function blend(base: number, added: number, mode: string, weight: number): number {
  const layerValue = added * weight;

  switch (mode) {
    case "add":
      return base + layerValue;
    case "subtract":
      return base - layerValue;
    case "multiply":
      return base * layerValue;
    case "max":
      return Math.max(base, layerValue);
    case "min":
      return Math.min(base, layerValue);
    case "screen":
      return 1 - (1 - base) * (1 - layerValue);
    case "overlay":
      return base < 0.5
        ? 2 * base * layerValue
        : 1 - 2 * (1 - base) * (1 - layerValue);
    case "difference":
      return Math.abs(base - layerValue);
    case "normal":
    default:
      // Linear interpolation for normal mode if it's not the first layer
      // If it's the first layer, base will be 0 and weight 1, so it results in 'added'
      return base * (1 - weight) + added * weight;
  }
}
