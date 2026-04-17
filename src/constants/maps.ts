import { Map } from "../types";

export const mapsData: Map[] = [
  {
    "id": 101,
    "name": "Emerald Archipelago",
    "biome": "Tropical",
    "complexity": 3,
    "description": "Scattered islands with dense tropical forests and shallow sandy lagoons.",
    "layers": [
      {
        "layerOrder": 1,
        "presetId": 1,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderValue": "water-to-grass"
      },
      {
        "layerOrder": 2,
        "presetId": 3,
        "type": "trees-scattering",
        "threshold": 0.65,
        "renderType": "emoji",
        "renderValue": "🌴"
      }
    ]
  },
  {
    "id": 102,
    "name": "Cursed Volcanic Faults",
    "biome": "Volcanic",
    "complexity": 5,
    "description": "A hostile wasteland of dark rocks torn apart by glowing lava rivers.",
    "layers": [
      {
        "layerOrder": 1,
        "presetId": 2,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderValue": "dark-rock"
      },
      {
        "layerOrder": 2,
        "presetId": 5,
        "type": "lava-rivers",
        "threshold": 0.85,
        "renderType": "emoji",
        "renderValue": "🔥"
      },
      {
        "layerOrder": 3,
        "presetId": 4,
        "type": "rocks-scattering",
        "threshold": 0.60,
        "renderType": "emoji",
        "renderValue": "🪨"
      }
    ]
  },
  {
    "id": 103,
    "name": "Frozen Tundra",
    "biome": "Ice",
    "complexity": 2,
    "description": "Endless snowy plains dotted with frozen lakes and sharp ice spikes.",
    "layers": [
      {
        "layerOrder": 1,
        "presetId": 1,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderValue": "snow-white"
      },
      {
        "layerOrder": 2,
        "presetId": 3,
        "type": "ice-spikes",
        "threshold": 0.75,
        "renderType": "emoji",
        "renderValue": "🧊"
      },
      {
        "layerOrder": 3,
        "presetId": 2,
        "type": "dead-trees",
        "threshold": 0.80,
        "renderType": "emoji",
        "renderValue": "🌲"
      }
    ]
  },
  {
    "id": 104,
    "name": "Alien Mushroom Swamp",
    "biome": "Alien",
    "complexity": 4,
    "description": "A toxic purple marshland overgrown with giant, glowing fungi.",
    "layers": [
      {
        "layerOrder": 1,
        "presetId": 4,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderValue": "purple-swamp"
      },
      {
        "layerOrder": 2,
        "presetId": 5,
        "type": "fungi-scattering",
        "threshold": 0.88,
        "renderType": "emoji",
        "renderValue": "🍄"
      }
    ]
  },
  {
    "id": 105,
    "name": "Dry Canyons",
    "biome": "Desert",
    "complexity": 3,
    "description": "Deep, eroded red rock canyons with sparse, hardy vegetation.",
    "layers": [
      {
        "layerOrder": 1,
        "presetId": 2,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderValue": "red-sandstone"
      },
      {
        "layerOrder": 2,
        "presetId": 3,
        "type": "cactus-scattering",
        "threshold": 0.70,
        "renderType": "emoji",
        "renderValue": "🌵"
      }
    ]
  }
];
