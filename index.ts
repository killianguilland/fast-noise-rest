import express, { Request, Response } from "express";
import FastNoiseLite from "fastnoise-lite";

const app = express();
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

  const { width = 64, height = 64, scale = 0.01 } = req.query;

  const noise = buildNoise(req.query as Record<string, any>);

  const w = Number(width);
  const h = Number(height);
  const s = Number(scale);

  const grid: number[][] = [];

  for (let y = 0; y < h; y++) {

    const row: number[] = [];

    for (let x = 0; x < w; x++) {

      row.push(noise.GetNoise(x * s, y * s));

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
Generate OpenAPI dynamically
*/
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
      title: "FastNoiseLite REST API",
      version: "1.0.0",
      description: "REST wrapper exposing all FastNoiseLite configuration options.<br/>See FastNoiseLite [documentation](https://docs.godotengine.org/en/stable/classes/class_fastnoiselite.html) for more information."
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
            { name: "width", in: "query", schema: { type: "number" } },
            { name: "height", in: "query", schema: { type: "number" } },
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
};

app.get(
  "/",
  apiReference(scalarConfig)
);

app.listen(port, () => {
  console.log(`Noise API running on http://localhost:${port}`);
});
