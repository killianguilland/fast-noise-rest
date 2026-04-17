import { Map } from "../types.js";

export const mapsData: Map[] = [
  {
    "id": 101,
    "name": "Emerald Archipelago",
    "difficulty": 2,
    "description": "Scattered islands with dense tropical forests and shallow sandy lagoons.",
    "layers": [
      {
        "presetId": 1,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderData": ["#0288D1", "#29B6F6", "#81C784"]
      },
      {
        "presetId": 3,
        "type": "scattering",
        "threshold": 0.65,
        "renderType": "emoji",
        "renderData": ["🌴", "🥥", "🦜"]
      }
    ]
  },
  {
    "id": 102,
    "name": "Cursed Volcanic Faults",
    "difficulty": 5,
    "description": "A hostile wasteland of dark rocks torn apart by glowing lava rivers.",
    "layers": [
      {
        "presetId": 2,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderData": ["#111111", "#2A2A2A", "#4A4A4A"]
      },
      {
        "presetId": 5,
        "type": "scattering",
        "threshold": 0.85,
        "renderType": "emoji",
        "renderData": ["🔥"]
      },
      {
        "presetId": 4,
        "type": "scattering",
        "threshold": 0.60,
        "renderType": "emoji",
        "renderData": ["🪨", "🌑"]
      }
    ]
  },
  {
    "id": 103,
    "name": "Frozen Tundra",
    "difficulty": 3,
    "description": "Endless snowy plains dotted with frozen lakes and sharp ice spikes.",
    "layers": [
      {
        "presetId": 1,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderData": ["#81D4FA", "#E0F7FA", "#FFFFFF"]
      },
      {
        "presetId": 3,
        "type": "scattering",
        "threshold": 0.75,
        "renderType": "emoji",
        "renderData": ["🧊", "❄️"]
      },
      {
        "presetId": 2,
        "type": "scattering",
        "threshold": 0.80,
        "renderType": "emoji",
        "renderData": ["🌲", "🐺"]
      }
    ]
  },
  {
    "id": 104,
    "name": "Alien Mushroom Swamp",
    "difficulty": 4,
    "description": "A toxic purple marshland overgrown with giant, glowing fungi.",
    "layers": [
      {
        "presetId": 4,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderData": ["#311B92", "#6A1B9A", "#9C27B0"]
      },
      {
        "presetId": 5,
        "type": "scattering",
        "threshold": 0.88,
        "renderType": "emoji",
        "renderData": ["🍄", "🟣", "👽"]
      }
    ]
  },
  {
    "id": 105,
    "name": "Dry Canyons",
    "difficulty": 2,
    "description": "Deep, eroded red rock canyons with sparse, hardy vegetation.",
    "layers": [
      {
        "presetId": 2,
        "type": "elevation",
        "threshold": 0.0,
        "renderType": "color-gradient",
        "renderData": ["#BF360C", "#D84315", "#FFCC80"]
      },
      {
        "presetId": 3,
        "type": "scattering",
        "threshold": 0.70,
        "renderType": "emoji",
        "renderData": ["🌵", "🏜️", "🐍"]
      }
    ]
  }
]
