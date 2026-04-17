import { parameters, enums } from "../services/noise-service.js";

export function buildOpenApi() {
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
    { name: "x", in: "query", schema: { type: "number" }, required: false },
    { name: "y", in: "query", schema: { type: "number" }, required: false },
    { name: "z", in: "query", schema: { type: "number" }, required: false }
  ];

  const paginationParams = [
    { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number for pagination" },
    { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Number of items per page" }
  ];

  return {
    openapi: "3.0.0",
    info: {
      title: "FastNoiseRest",
      version: "1.0.0",
      description: "REST wrapper exposing all FastNoiseLite configuration options.<br/><br/>Documentation for complex noise presets and biome maps."
    },
    paths: {
      "/value": {
        get: {
          summary: "Get a single noise value",
          operationId: "getNoiseValue",
          tags: ["Noise Generation"],
          parameters: [...baseXY, ...queryParams],
          responses: {
            "200": {
              description: "Noise value",
              content: { "application/json": { schema: { type: "object", properties: { value: { type: "number" } } } } }
            }
          }
        }
      },
      "/grid": {
        get: {
          summary: "Generate a noise grid",
          operationId: "getNoiseGrid",
          tags: ["Noise Generation"],
          parameters: [
            { name: "x", in: "query", schema: { type: "number" } },
            { name: "y", in: "query", schema: { type: "number" } },
            { name: "z", in: "query", schema: { type: "number" } },
            { name: "width", in: "query", schema: { type: "number", maximum: 500 } },
            { name: "height", in: "query", schema: { type: "number", maximum: 500 } },
            { name: "scale", in: "query", schema: { type: "number" } },
            ...queryParams
          ],
          responses: {
            "200": {
              description: "Noise grid",
              content: { "application/json": { schema: { type: "object", properties: { width: { type: "number" }, height: { type: "number" }, data: { type: "array", items: { type: "array", items: { type: "number" } } } } } } }
            }
          }
        }
      },
      "/schema": {
        get: {
          summary: "Get FastNoiseLite schema",
          operationId: "getNoiseSchema",
          tags: ["Configuration"],
          responses: {
            "200": {
              description: "Parameters schema",
              content: { "application/json": { schema: { type: "object", properties: { fastNoiseLiteParameters: { type: "array", items: { type: "object" } } } } } }
            }
          }
        }
      },
      "/presets": {
        get: {
          summary: "Get a list of noise presets",
          operationId: "getPresets",
          tags: ["Presets"],
          description: "Returns a collection of multi-layer noise configurations. Each preset defines how multiple noise layers are blended together.",
          responses: {
            "200": {
              description: "List of complex noise presets",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Preset" } },
                  example: [
                    {
                      id: 1,
                      name: "Eroded Plains",
                      description: "Vast rolling plains with slight surface perturbations.",
                      rating: 4.2,
                      layers: [
                        { layerName: "Base", noiseType: "OpenSimplex2", frequency: 0.01, fractalType: "None", blendMode: "normal", weight: 1.0 }
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      "/presets/{id}/grid": {
        get: {
          summary: "Generate a noise grid from a composite preset",
          operationId: "getPresetGridById",
          tags: ["Presets"],
          description: "Fetches a preset by ID, generates noise for each of its layers, and blends them together mathematically into a single composite grid.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
            { name: "x", in: "query", schema: { type: "number" } },
            { name: "y", in: "query", schema: { type: "number" } },
            { name: "z", in: "query", schema: { type: "number" } },
            { name: "width", in: "query", schema: { type: "number", maximum: 500 } },
            { name: "height", in: "query", schema: { type: "number", maximum: 500 } },
            { name: "scale", in: "query", schema: { type: "number" } },
            { name: "seed", in: "query", schema: { type: "integer" } }
          ],
          responses: {
            "200": {
              description: "Composite noise grid",
              content: { "application/json": { schema: { type: "object", properties: { width: { type: "number" }, height: { type: "number" }, data: { type: "array", items: { type: "array", items: { type: "number" } } } } } } }
            }
          }
        }
      },
      "/maps": {
        get: {
          summary: "Get a paginated list of maps",
          operationId: "getMaps",
          tags: ["Maps"],
          description: "Returns map objects that combine noise presets with rendering rules (colors, emojis) and thresholds.",
          parameters: paginationParams,
          responses: {
            "200": {
              description: "Paginated list of maps",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      data: { type: "array", items: { $ref: "#/components/schemas/Map" } },
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
      }
    },
    components: {
      schemas: {
        Preset: {
          type: "object",
          required: ["id", "name", "description", "rating", "layers"],
          properties: {
            id: { type: "integer", description: "Unique identifier for the preset" },
            name: { type: "string", description: "Creative name for the preset" },
            description: { type: "string" },
            rating: { type: "number", format: "float", minimum: 1, maximum: 5 },
            layers: { type: "array", items: { $ref: "#/components/schemas/PresetLayer" } }
          }
        },
        PresetLayer: {
          type: "object",
          properties: {
            layerName: { type: "string" },
            noiseType: { type: "string", enum: enums.NoiseType },
            frequency: { type: "number", format: "float", example: 0.01 },
            fractalType: { type: "string", enum: enums.FractalType },
            blendMode: {
              type: "string",
              enum: ["normal", "add", "multiply", "subtract", "max", "min", "screen", "overlay", "difference"],
              description: "Mathematical operation used to combine this layer with previous ones:<br/>" +
                "- **normal**: Replacement or linear interpolation based on weight.<br/>" +
                "- **add**: Simple addition of noise values.<br/>" +
                "- **multiply**: Multiplies the underlying value by the layer value.<br/>" +
                "- **subtract**: Subtracts the layer value from the current base.<br/>" +
                "- **max / min**: Logical comparison, keeping only the extreme values.<br/>" +
                "- **screen**: Lightens the result (1 - (1-a)*(1-b)).<br/>" +
                "- **overlay**: High-contrast blend mode combining multiply and screen.<br/>" +
                "- **difference**: Absolute difference between values, useful for complex structural patterns."
            },
            weight: { type: "number", format: "float", description: "Importance of this layer in the final result (0.0 to 1.0)" }
          }
        },
        Map: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            difficulty: { type: "integer", minimum: 1, maximum: 5 },
            description: { type: "string" },
            layers: { type: "array", items: { $ref: "#/components/schemas/MapLayer" } }
          }
        },
        MapLayer: {
          type: "object",
          properties: {
            presetId: { type: "integer", description: "ID of the noise preset to use" },
            type: { type: "string", description: "Functional type of the layer (e.g., elevation, scattering)" },
            threshold: { type: "number", format: "float", description: "Noise value threshold for rendering" },
            renderType: { type: "string", enum: ["color-gradient", "emoji"] },
            renderData: { type: "array", items: { type: "string" }, description: "List of colors or emojis to use for rendering" }
          }
        }
      }
    }
  };
}
