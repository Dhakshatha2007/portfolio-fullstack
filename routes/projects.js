const crypto = require('crypto');
const express = require('express');
const Project = require('../models/Project');

const router = express.Router();

// Only requests with the correct x-admin-key header may change data.
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  const given = req.get('x-admin-key') || '';
  if (!expected) return res.status(503).json({ error: 'Editing is disabled: ADMIN_KEY is not set.' });
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Invalid admin key.' });
  }
  next();
}

// Public: list projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(projects);
  } catch (err) { next(err); }
});

// Public: one project by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) { next(err); }
});

// Admin: create
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { next(err); }
});

// Admin: update
router.put('/:slug', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) { next(err); }
});

// Admin: delete
router.delete('/:slug', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ deleted: project.slug });
  } catch (err) { next(err); }
});

module.exports = router;
