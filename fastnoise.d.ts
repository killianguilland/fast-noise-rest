declare module "fastnoise-lite" {

  export default class FastNoiseLite {
    static NoiseType: Record<string, string>;
    static RotationType3D: Record<string, string>;
    static FractalType: Record<string, string>;
    static CellularDistanceFunction: Record<string, string>;
    static CellularReturnType: Record<string, string>;
    static DomainWarpType: Record<string, string>;
    
    GetNoise(x: number, y: number, z?: number): number;
    // other methods are invoked dynamically via bracket notation
    [key: string]: any;
  }
}
