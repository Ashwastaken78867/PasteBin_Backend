import express from "express";
import { createPaste } from "../controllers/pasteController.js";

const router = express.Router();

router.post("/pastes", createPaste);

export default router;
