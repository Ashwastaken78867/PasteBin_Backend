import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.js";
import pasteRoutes from "./routes/pastes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoute);
app.use("/api", pasteRoutes);


export default app;
