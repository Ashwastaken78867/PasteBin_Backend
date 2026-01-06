import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/healthz", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    ok: isDbConnected,
  });
});

export default router;
