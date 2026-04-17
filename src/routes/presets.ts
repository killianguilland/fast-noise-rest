import { Router, Request, Response } from "express";
import { presetsData } from "../constants/presets.js";
import { buildNoise, generateGrid, blend } from "../services/noise-service.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(presetsData);
});

router.get("/:id/grid", (req: Request, res: Response) => {
  const preset = presetsData.find(p => p.id === Number(req.params.id));
  if (!preset) {
    return res.status(404).json({ error: "Preset not found" });
  }

  const { width = 64, height = 64, scale = 0.01, x = 0, y = 0, z } = req.query;

  const w = Math.min(Number(width), 500);
  const h = Math.min(Number(height), 500);
  const s = Number(scale);
  const startX = Number(x);
  const startY = Number(y);
  const zCoord = z !== undefined ? Number(z) : undefined;

  // Initialize composite grid with zeros
  const compositeGrid: number[][] = Array.from({ length: h }, () => Array(w).fill(0));

  preset.layers.forEach((layer, index) => {
    const noise = buildNoise({
      ...layer,
      seed: req.query.seed || 12345 // Use query seed if provided, else default
    });

    const layerGrid = generateGrid(noise, w, h, s, startX, startY, zCoord);

    for (let iy = 0; iy < h; iy++) {
      for (let ix = 0; ix < w; ix++) {
        const val = layerGrid[iy][ix];
        if (index === 0) {
          // First layer is the base
          compositeGrid[iy][ix] = val * layer.weight;
        } else {
          compositeGrid[iy][ix] = blend(compositeGrid[iy][ix], val, layer.blendMode, layer.weight);
        }
      }
    }
  });

  res.json({ width: w, height: h, data: compositeGrid });
});

export default router;
