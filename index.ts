import express, { Request, Response } from "express";
import cors from "cors";
import FastNoiseLite from "fastnoise-lite";

const app = express();
app.use(cors());
const port = process.argv[2] || 3000;

/*
Detect FastNoiseLite setters
*/
const setters = Object.getOwnPropertyNames(FastNoiseLite.prototype)
  .filter(n => n.startsWith("Set"));

// Enums available in FastNoiseLite
const enums = {
  NoiseType: Object.keys((FastNoiseLite as any).NoiseType || {}),
  RotationType3D: Object.keys((FastNoiseLite as any).RotationType3D || {}),
  FractalType: Object.keys((FastNoiseLite as any).FractalType || {}),
  CellularDistanceFunction: Object.keys((FastNoiseLite as any).CellularDistanceFunction || {}),
  CellularReturnType: Object.keys((FastNoiseLite as any).CellularReturnType || {}),
  DomainWarpType: Object.keys((FastNoiseLite as any).DomainWarpType || {}),
};

const parameters = setters.map(s => {
  const originalName = s.replace("Set", "");
  const camelName = originalName.charAt(0).toLowerCase() + originalName.slice(1);
  const possibleValues = enums[originalName as keyof typeof enums];

  return {
    name: camelName,
    originalName,
    type: possibleValues ? "string" : "number",
    enumValues: possibleValues
  };
});

/*
Static Presets Data
*/
const presetsData = [
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

/*
Static Maps Data
*/
const mapsData = [
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

/*
Apply parameters dynamically
*/
function applyParams(noise: FastNoiseLite, params: Record<string, any>) {

  for (const [key, value] of Object.entries(params)) {

    const setter = "Set" + key.charAt(0).toUpperCase() + key.slice(1);

    if (setters.includes(setter)) {

      const num = Number(value);

      // @ts-ignore
      noise[setter as keyof FastNoiseLite](isNaN(num) ? value : num);
    }
  }
}

function buildNoise(params: Record<string, any>) {

  const noise = new FastNoiseLite();

  applyParams(noise, params);

  return noise;
}

/*
Noise value endpoint
*/
app.get("/value", (req: Request, res: Response) => {

  const { x = 0, y = 0, z } = req.query;

  const noise = buildNoise(req.query as Record<string, any>);

  let value: number;

  if (z !== undefined)
    value = noise.GetNoise(Number(x), Number(y), Number(z));
  else
    value = noise.GetNoise(Number(x), Number(y));

  res.json({ value });

});

/*
Grid endpoint
*/
app.get("/grid", (req: Request, res: Response) => {

  const { width = 64, height = 64, scale = 0.01, x = 0, y = 0, z } = req.query;

  const noise = buildNoise(req.query as Record<string, any>);

  const w = Math.min(Number(width), 500);
  const h = Math.min(Number(height), 500);
  const s = Number(scale);
  const startX = Number(x);
  const startY = Number(y);
  const zCoord = z !== undefined ? Number(z) : undefined;

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

  res.json({
    width: w,
    height: h,
    data: grid
  });

});

/*
Schema endpoint
*/
app.get("/schema", (req: Request, res: Response) => {

  res.json({
    fastNoiseLiteParameters: parameters
  });

});

/*
Presets endpoint
*/
app.get("/presets", (req: Request, res: Response) => {
  res.json(presetsData);
});

/*
Maps endpoint with pagination
*/
app.get("/maps", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = mapsData.slice(startIndex, endIndex);
  
  res.json({
    data: results,
    pagination: {
      totalItems: mapsData.length,
      totalPages: Math.ceil(mapsData.length / limit),
      currentPage: page,
      limit: limit
    }
  });
});
function buildOpenApi() {

  const queryParams = parameters.map(p => {
    const param: any = {
      name: p.name,
      in: "query",
      schema: { type: p.type },
      required: false,
      description: `Mapped to FastNoiseLite parameter ${p.name}`
    };

    if (p.enumValues) {
      param.schema.enum = p.enumValues;
    }

    return param;
  });

  const baseXY = [
    {
      name: "x",
      in: "query",
      schema: { type: "number" },
      required: false
    },
    {
      name: "y",
      in: "query",
      schema: { type: "number" },
      required: false
    },
    {
      name: "z",
      in: "query",
      schema: { type: "number" },
      required: false
    }
  ];

  return {
    openapi: "3.0.0",
    info: {
      title: "FastNoiseRest",
      version: "1.0.0",
      description: "REST wrapper exposing all FastNoiseLite configuration options.<br/><br/>See FastNoiseLite [documentation](https://docs.godotengine.org/en/stable/classes/class_fastnoiselite.html) for more information.<br/>Deploy your own api wrapper using the open-source [repository](https://github.com/killianguilland/fast-noise-rest)."
    },
    paths: {
      "/value": {
        get: {
          summary: "Get a single noise value",
          parameters: [...baseXY, ...queryParams],
          responses: {
            "200": {
              description: "Noise value",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      value: { type: "number" }
                    }
                  },
                  example: {
                    value: 0.49534581752327544
                  }
                }
              }
            }
          }
        }
      },

      "/grid": {
        get: {
          summary: "Generate a noise grid",
          parameters: [
            { name: "x", in: "query", schema: { type: "number" }, description: "Starting X coordinate" },
            { name: "y", in: "query", schema: { type: "number" }, description: "Starting Y coordinate" },
            { name: "z", in: "query", schema: { type: "number" }, description: "Optional Z coordinate for a 2D slice of 3D noise" },
            { name: "width", in: "query", schema: { type: "number", maximum: 500 }, description: "Width of the grid (max 500)" },
            { name: "height", in: "query", schema: { type: "number", maximum: 500 }, description: "Height of the grid (max 500)" },
            { name: "scale", in: "query", schema: { type: "number" } },
            ...queryParams
          ],
          responses: {
            "200": {
              description: "Noise grid",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      width: { type: "number" },
                      height: { type: "number" },
                      data: {
                        type: "array",
                        items: {
                          type: "array",
                          items: { type: "number" }
                        }
                      }
                    }
                  },
                  example: {
                    width: 4,
                    height: 4,
                    data: [
                      [
                        0.0013699283903753415,
                        0.00037985513330317396,
                        0.0007597100842758968,
                        0.0011395646705878257
                      ],
                      [
                        0.0004950368477246744,
                        0.0008748919110364906,
                        0.0012547467128119862,
                        0.0016346010707208717
                      ],
                      [
                        0.0009900734578316788,
                        0.0013699283903753415,
                        0.0017497829821768649,
                        0.002129637050906035
                      ],
                      [
                        0.0014851095927034842,
                        0.0018649643337022453,
                        0.0022448186547531267,
                        0.0026246723735260107
                      ]
                    ]
                  }
                }
              }
            }
          }
        }
      },

      "/presets": {
        get: {
          summary: "Get a list of noise presets",
          description: "Returns a collection of noise compositions with multiple layers and blend modes.",
          responses: {
            "200": {
              description: "Array of complex presets",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Preset"
                    }
                  }
                }
              }
            }
          }
        }
      },

      "/maps": {
        get: {
          summary: "Get a paginated list of biome maps",
          description: "Returns structured map objects that combine multiple noise presets to define complex biomes.",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
          ],
          responses: {
            "200": {
              description: "Paginated list of maps",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Map" }
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          totalItems: { type: "integer" },
                          totalPages: { type: "integer" },
                          currentPage: { type: "integer" },
                          limit: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    components: {
      schemas: {
        Preset: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            rating: { type: "number" },
            layers: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Layer"
              }
            }
          }
        },
        Layer: {
          type: "object",
          properties: {
            layerName: { type: "string" },
            noiseType: { type: "string" },
            frequency: { type: "number" },
            fractalType: { type: "string" },
            blendMode: { type: "string" },
            weight: { type: "number" }
          }
        },
        Map: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            biome: { type: "string" },
            complexity: { type: "integer" },
            description: { type: "string" },
            layers: {
              type: "array",
              items: { $ref: "#/components/schemas/MapLayer" }
            }
          }
        },
        MapLayer: {
          type: "object",
          properties: {
            layerOrder: { type: "integer" },
            presetId: { type: "integer" },
            type: { type: "string" },
            threshold: { type: "number" },
            renderType: { type: "string" },
            renderValue: { type: "string" }
          }
        }
      }
    }
  };
}

const openApiSpec = buildOpenApi();

/*
OpenAPI JSON
*/
app.get("/openapi.json", (req: Request, res: Response) => {

  res.json(openApiSpec);

});

/*
Swagger UI
*/
import { apiReference } from "@scalar/express-api-reference";

const scalarConfig = {
  spec: {
    content: openApiSpec,
  },
  theme: "deepSpace" as const,
  hideClientButton: true,
  showSidebar: false,
  pageTitle: "FastNoiseRest",
};

app.get(
  "/",
  apiReference(scalarConfig)
);

app.listen(port, () => {
  console.log(`Noise API running on http://localhost:${port}`);
});
