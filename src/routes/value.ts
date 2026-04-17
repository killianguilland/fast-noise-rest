import { Router, Request, Response } from "express";
import { buildNoise } from "../services/noise-service";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const { x = 0, y = 0, z } = req.query;
  const noise = buildNoise(req.query as Record<string, any>);

  let value: number;
  if (z !== undefined)
    value = noise.GetNoise(Number(x), Number(y), Number(z));
  else
    value = noise.GetNoise(Number(x), Number(y));

  res.json({ value });
});

export default router;
