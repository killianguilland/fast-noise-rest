import express from "express";
import FastNoiseLite from "fastnoise-lite";

const app = express();
const port = process.argv[2] || 3000;

/*
Detect FastNoiseLite setters
*/
const setters = Object.getOwnPropertyNames(FastNoiseLite.prototype)
  .filter(n => n.startsWith("Set"));

const parameters = setters.map(s => s.replace("Set", ""));

/*
Apply parameters dynamically
*/
function applyParams(noise, params) {

  for (const [key, value] of Object.entries(params)) {

    const setter = "Set" + key;

    if (setters.includes(setter)) {

      const num = Number(value);

      noise[setter](isNaN(num) ? value : num);

    }
  }
}

function buildNoise(params) {

  const noise = new FastNoiseLite();

  applyParams(noise, params);

  return noise;
}

/*
Noise value endpoint
*/
app.get("/noise/value", (req, res) => {

  const { x = 0, y = 0, z } = req.query;

  const noise = buildNoise(req.query);

  let value;

  if (z !== undefined)
    value = noise.GetNoise(Number(x), Number(y), Number(z));
  else
    value = noise.GetNoise(Number(x), Number(y));

  res.json({ value });

});

/*
Grid endpoint
*/
app.get("/noise/grid", (req, res) => {

  const { width = 64, height = 64, scale = 0.01 } = req.query;

  const noise = buildNoise(req.query);

  const w = Number(width);
  const h = Number(height);
  const s = Number(scale);

  const grid = [];

  for (let y = 0; y < h; y++) {

    const row = [];

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
Domain warp endpoint
*/
// app.get("/noise/warp", (req, res) => {

//   const { x = 0, y = 0 } = req.query;

//   const noise = buildNoise(req.query);

//   const pos = { x: Number(x), y: Number(y) };

//   noise.DomainWarp(pos);

//   res.json(pos);

// });

/*
Schema endpoint
*/
app.get("/schema", (req, res) => {

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
    description: `FastNoiseLite parameter ${p}`
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

      "/noise/value": {
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

      "/noise/grid": {
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

      // "/noise/warp": {
      //   get: {
      //     summary: "Apply domain warp",
      //     parameters: [
      //       { name: "x", in: "query", schema: { type: "number" } },
      //       { name: "y", in: "query", schema: { type: "number" } },
      //       ...queryParams
      //     ],
      //     responses: {
      //       "200": {
      //         description: "Warped coordinates"
      //       }
      //     }
      //   }
      // }

    }
  };
}

const openApiSpec = buildOpenApi();

/*
OpenAPI JSON
*/
app.get("/openapi.json", (req, res) => {

  res.json(openApiSpec);

});

/*
Swagger UI
*/
import { apiReference } from "@scalar/express-api-reference";

app.get(
  "/",
  apiReference({
    spec: {
      content: openApiSpec,
    },
    theme: "purple",
  })
);

app.listen(port, () => {
  console.log(`Noise API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
});