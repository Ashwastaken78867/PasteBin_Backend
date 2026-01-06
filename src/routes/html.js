import express from "express";
import Paste from "../models/Paste.js";
import { getNowMs } from "../utils/time.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const now = getNowMs(req);

  const paste = await Paste.findOne({ _id: req.params.id });

  if (!paste) {
    return res.status(404).send("<h3>Paste not found</h3>");
  }

  if (paste.expiresAt && paste.viewCount >= paste.maxViews) {
    return res.status(404).send("<h3>Paste unavailable</h3>");
  }

  paste.viewCount += 1;
  await paste.save();

  const safeContent = paste.content
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return res.status(200).send(`
    <html>
      <body>
        <h2>Your Paste</h2>
        <pre>${safeContent}</pre>
      </body>
    </html>
  `);
});

export default router;
