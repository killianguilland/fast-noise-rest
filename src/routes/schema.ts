import { Router, Request, Response } from "express";
import { parameters } from "../services/noise-service.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ fastNoiseLiteParameters: parameters });
});

export default router;
