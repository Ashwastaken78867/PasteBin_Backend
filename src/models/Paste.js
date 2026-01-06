import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  expiresAt: {
    type: Date,
    default: null,
  },

  maxViews: {
    type: Number,
    default: null,
  },

  viewCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Paste", pasteSchema);
