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
