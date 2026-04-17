import { Router, Request, Response } from "express";
import { buildOpenApi } from "../docs/openapi-spec";
import { apiReference } from "@scalar/express-api-reference";

const router = Router();
const spec = buildOpenApi();

router.get("/openapi.json", (req: Request, res: Response) => {
  res.json(spec);
});

router.get("/", apiReference({
  spec: { content: spec },
  theme: "deepSpace",
  hideClientButton: true,
  showSidebar: false,
  pageTitle: "FastNoiseRest",
}));

export default router;
