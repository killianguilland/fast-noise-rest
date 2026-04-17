import { Router, Request, Response } from "express";
import { buildNoise, generateGrid } from "../services/noise-service.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { width = 64, height = 64, scale = 0.01, x = 0, y = 0, z } = req.query;
  const noise = buildNoise(req.query as Record<string, any>);

  const w = Math.min(Number(width), 500);
  const h = Math.min(Number(height), 500);
  const s = Number(scale);
  const startX = Number(x);
  const startY = Number(y);
  const zCoord = z !== undefined ? Number(z) : undefined;

  const grid = generateGrid(noise, w, h, s, startX, startY, zCoord);

  res.json({ width: w, height: h, data: grid });
});

export default router;
