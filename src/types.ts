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
  presetId: number;
  type: string;
  threshold: number;
  renderType: string;
  renderData: string[];
}

export interface Map {
  id: number;
  name: string;
  difficulty: number;
  description: string;
  layers: MapLayer[];
}
