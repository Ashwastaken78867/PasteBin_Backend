import express from "express";
import Paste from "../models/Paste.js";
import { getNowMs } from "../utils/time.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const now = getNowMs(req);

  const paste = await Paste.findById(req.params.id);

  if (!paste) {
    return res.status(404).send("<h3>Paste not found</h3>");
  }

  if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
    return res.status(410).send("<h3>Paste expired</h3>");
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return res.status(410).send("<h3>View limit exceeded</h3>");
  }

  return res.send(`<pre>${paste.content}</pre>`);
});

export default router;
