import express, { Request, Response } from "express";
import FastNoiseLite from "fastnoise-lite";

const app = express();
const port = process.argv[2] || 3000;

/*
Detect FastNoiseLite setters
*/
const setters = Object.getOwnPropertyNames(FastNoiseLite.prototype)
  .filter(n => n.startsWith("Set"));

const parameters = setters.map(s => {
  const name = s.replace("Set", "");
  return name.charAt(0).toLowerCase() + name.slice(1);
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

  const queryParams = parameters.map(p => ({
    name: p,
    in: "query",
    schema: { type: "string" },
    required: false,
  }));

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
      description: "REST wrapper exposing all FastNoiseLite configuration options"
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
              description: "Noise grid"
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
