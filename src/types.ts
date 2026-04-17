export interface PresetLayer {
  layerName: string;
  noiseType: string;
  frequency: number;
  fractalType: string;
  blendMode: string;
  weight: number;
}

export interface Preset {
  id: number;
  name: string;
  description: string;
  rating: number;
  layers: PresetLayer[];
}

export interface MapLayer {
  layerOrder: number;
  presetId: number;
  type: string;
  threshold: number;
  renderType: string;
  renderValue: string;
}

export interface Map {
  id: number;
  name: string;
  biome: string;
  complexity: number;
  description: string;
  layers: MapLayer[];
}
