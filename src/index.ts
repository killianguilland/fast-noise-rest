import express from "express";
import cors from "cors";
import valueRouter from "./routes/value.js";
import gridRouter from "./routes/grid.js";
import schemaRouter from "./routes/schema.js";
import presetsRouter from "./routes/presets.js";
import mapsRouter from "./routes/maps.js";
import docsRouter from "./routes/docs.js";

const app = express();
app.use(cors());

const port = process.argv[2] || 3000;

// Register routes
app.use("/value", valueRouter);
app.use("/grid", gridRouter);
app.use("/schema", schemaRouter);
app.use("/presets", presetsRouter);
app.use("/maps", mapsRouter);
app.use("/", docsRouter);

app.listen(port, () => {
  console.log(`Noise API running on http://localhost:${port}`);
});
