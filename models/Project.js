const mongoose = require('mongoose');

// One block of a project card, e.g. { label: "Problem", text: "..." }
// A block can hold plain text, a bullet list (items) or small tags (chips).
const sectionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 60 },
    text: { type: String, trim: true, maxlength: 1000 },
    items: [{ type: String, trim: true, maxlength: 300 }],
    chips: [{ type: String, trim: true, maxlength: 40 }],
  },
  { _id: false }
);

// A link, or a plain note when no url is given (e.g. "GitHub repo coming soon").
const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    url: { type: String, trim: true, maxlength: 300, match: /^https?:\/\//i },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    status: { type: String, required: true, trim: true, maxlength: 80 },
    statusTone: { type: String, enum: ['ok', 'wip'], default: 'ok' },
    links: [linkSchema],
    sections: [sectionSchema],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
