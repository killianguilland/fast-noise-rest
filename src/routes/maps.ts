import { Router, Request, Response } from "express";
import { mapsData } from "../constants/maps.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
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

export default router;
