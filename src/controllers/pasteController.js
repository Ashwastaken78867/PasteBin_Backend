import Paste from "../models/Paste.js";
import { getNowMs } from "../utils/time.js";

export async function createPaste(req, res) {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content is required" });
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return res.status(400).json({ error: "ttl_seconds must be >= 1" });
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return res.status(400).json({ error: "max_views must be >= 1" });
      }
    }

    const now = getNowMs(req);

    const expiresAt =
      ttl_seconds !== undefined
        ? new Date(now + ttl_seconds * 1000)
        : null;

    console.log("Received max_views:", max_views);

    const paste = await Paste.create({
      content,
      createdAt: new Date(now),
      expiresAt,
      maxViews: max_views ?? null,      // FIXED VARIABLE
      viewCount: 0,
    });

    return res.status(201).json({
      id: paste._id.toString(),
      url: `${req.protocol}://${req.get("host")}/p/${paste._id.toString()}`,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

export async function fetchPaste(req, res) {
  try {
    const id = req.params.id;
    const now = getNowMs(req);

    const paste = await Paste.findOne({ _id: id });

    if (!paste) {
      return res.status(404).json({ error: "paste not found" });
    }

    if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
      return res.status(410).json({ error: "paste expired" });
    }

    if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
      return res.status(410).json({ error: "view limit exceeded" });
    }

    paste.viewCount += 1;
    await paste.save();

    const remaining =
      paste.maxViews !== null
        ? Math.max(0, paste.maxViews - paste.viewCount)
        : null;

    return res.status(200).json({
      content: paste.content,
      remaining_views: remaining,
      expires_at: paste.expiresAt ?? null,
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "invalid paste id format" });
  }
}
