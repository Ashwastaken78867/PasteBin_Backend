import express from "express";
import { createPaste, fetchPaste } from "../controllers/pasteController.js";

const router = express.Router();

router.post("/", createPaste);

router.get("/:id", fetchPaste);

export default router;
