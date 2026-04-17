import { Router, Request, Response } from "express";
import { presetsData } from "../constants/presets";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json(presetsData);
});

export default router;
