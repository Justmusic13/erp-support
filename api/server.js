const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Database ──────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ── Init DB table on startup ──────────────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS erp_configs (
      id TEXT PRIMARY KEY,
      config JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('Database ready');
}

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json({ limit: '2mb' }));

// ── Simple API key auth for write operations ───────────────────────────────────
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!process.env.API_SECRET || key === process.env.API_SECRET) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// GET all ERPs
app.get('/api/erps', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT config FROM erp_configs ORDER BY created_at ASC'
    );
    res.json(result.rows.map(r => r.config));
  } catch (err) {
    console.error('GET /api/erps error:', err);
    res.status(500).json({ error: 'Failed to fetch ERPs' });
  }
});

// GET single ERP
app.get('/api/erps/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT config FROM erp_configs WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ERP not found' });
    }
    res.json(result.rows[0].config);
  } catch (err) {
    console.error('GET /api/erps/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch ERP' });
  }
});

// POST create ERP
app.post('/api/erps', requireApiKey, async (req, res) => {
  const config = req.body;
  if (!config?.id) {
    return res.status(400).json({ error: 'Missing ERP id' });
  }
  try {
    await pool.query(
      `INSERT INTO erp_configs (id, config)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE
         SET config = $2, updated_at = NOW()`,
      [config.id, JSON.stringify(config)]
    );
    res.status(201).json(config);
  } catch (err) {
    console.error('POST /api/erps error:', err);
    res.status(500).json({ error: 'Failed to create ERP' });
  }
});

// PUT update ERP
app.put('/api/erps/:id', requireApiKey, async (req, res) => {
  const config = req.body;
  try {
    const result = await pool.query(
      `UPDATE erp_configs SET config = $1, updated_at = NOW()
       WHERE id = $2 RETURNING config`,
      [JSON.stringify(config), req.params.id]
    );
    if (result.rows.length === 0) {
      // ERP doesn't exist in DB yet (it's a static default being edited for first time)
      // Insert it instead
      await pool.query(
        `INSERT INTO erp_configs (id, config) VALUES ($1, $2)`,
        [req.params.id, JSON.stringify(config)]
      );
    }
    res.json(config);
  } catch (err) {
    console.error('PUT /api/erps/:id error:', err);
    res.status(500).json({ error: 'Failed to update ERP' });
  }
});

// DELETE ERP
app.delete('/api/erps/:id', requireApiKey, async (req, res) => {
  try {
    await pool.query('DELETE FROM erp_configs WHERE id = $1', [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (err) {
    console.error('DELETE /api/erps/:id error:', err);
    res.status(500).json({ error: 'Failed to delete ERP' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
