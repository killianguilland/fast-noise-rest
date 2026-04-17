import { Router, Request, Response } from "express";
import { buildOpenApi } from "../docs/openapi-spec.js";
import { apiReference } from "@scalar/express-api-reference";

const router = Router();
const spec = buildOpenApi();

router.get("/openapi.json", (req: Request, res: Response) => {
  res.json(spec);
});

router.get("/", apiReference({
  content: spec,
  theme: "deepSpace",
  hideClientButton: true,
  showSidebar: true,
  pageTitle: "FastNoiseRest",
}));

export default router;
