declare module "fastnoise-lite" {
  export default class FastNoiseLite {
    GetNoise(x: number, y: number, z?: number): number;
    // other methods are invoked dynamically via bracket notation
    [key: string]: any;
  }
}
