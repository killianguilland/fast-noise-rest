import { Preset } from "../types.js";

export const presetsData: Preset[] = [
  {
    "id": 1,
    "name": "Eroded Plains",
    "description": "Vast rolling plains with slight surface perturbations.",
    "rating": 4.2,
    "layers": [
      {
        "layerName": "Base Elevation",
        "noiseType": "OpenSimplex2",
        "frequency": 0.01,
        "fractalType": "None",
        "blendMode": "normal",
        "weight": 1.0
      },
      {
        "layerName": "Surface Details",
        "noiseType": "Perlin",
        "frequency": 0.05,
        "fractalType": "FBm",
        "blendMode": "add",
        "weight": 0.15
      }
    ]
  },
  {
    "id": 2,
    "name": "Jagged Peaks",
    "description": "Steep and dangerous mountains, ideal for hostile environments.",
    "rating": 4.8,
    "layers": [
      {
        "layerName": "Ridged Mountains",
        "noiseType": "OpenSimplex2S",
        "frequency": 0.015,
        "fractalType": "Ridged",
        "blendMode": "normal",
        "weight": 1.0
      },
      {
        "layerName": "High Frequency Noise",
        "noiseType": "ValueCubic",
        "frequency": 0.08,
        "fractalType": "None",
        "blendMode": "multiply",
        "weight": 0.8
      }
    ]
  },
  {
    "id": 3,
    "name": "Cellular Tissue",
    "description": "An organic pattern shaped like a web or interconnected cells.",
    "rating": 3.5,
    "layers": [
      {
        "layerName": "Cell Base",
        "noiseType": "Cellular",
        "frequency": 0.04,
        "fractalType": "None",
        "blendMode": "normal",
        "weight": 1.0
      },
      {
        "layerName": "Hole Carver",
        "noiseType": "OpenSimplex2",
        "frequency": 0.06,
        "fractalType": "None",
        "blendMode": "subtract",
        "weight": 0.3
      }
    ]
  },
  {
    "id": 4,
    "name": "Alien Desert",
    "description": "Shifting dunes with strange plateaus created by domain warping.",
    "rating": 4.5,
    "layers": [
      {
        "layerName": "Warped Dunes",
        "noiseType": "Perlin",
        "frequency": 0.02,
        "fractalType": "DomainWarpProgressive",
        "blendMode": "normal",
        "weight": 1.0
      },
      {
        "layerName": "Alien Plateaus",
        "noiseType": "Cellular",
        "frequency": 0.03,
        "fractalType": "PingPong",
        "blendMode": "max",
        "weight": 0.5
      }
    ]
  },
  {
    "id": 5,
    "name": "Raw White Noise",
    "description": "Total visual chaos, very dense and grainy.",
    "rating": 2.1,
    "layers": [
      {
        "layerName": "Pure Noise",
        "noiseType": "Value",
        "frequency": 0.5,
        "fractalType": "None",
        "blendMode": "normal",
        "weight": 1.0
      }
    ]
  }
];
