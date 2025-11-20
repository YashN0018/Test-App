// Minimal Express server with one "Data Ingestion and Sync" endpoint.
// Fixed: removed duplicate/conflicting app.post blocks, added file persistence and proper async handling.

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Serve frontend files from ./public
app.use('/', express.static(path.join(__dirname, 'public')));

// Simple file-backed store for demo persistence
const DATA_FILE = path.join(__dirname, 'data.json');
let store = {
  clients: {},       // clientId -> client record
  dossiers: {},      // dossierId -> dossier record
  assignments: {},   // assignmentId -> assignment record
  auditTrail: []     // array of audit entries
};

// Try to load existing data file on startup
async function loadStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    store = JSON.parse(raw);
    console.log('Loaded data.json');
  } catch (err) {
    console.log('No data.json found, starting with empty store');
  }
}
async function saveStore() {
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

let nextId = 1;
function genId(prefix) {
  return `${prefix}_${Date.now()}_${nextId++}`;
}

// Helper: compute sha256 hash snapshot for a record
function snapshotHash(obj) {
  const json = JSON.stringify(obj);
  return crypto.createHash('sha256').update(json).digest('hex');
}

// Minimal duplicate detection by name or registrationNumber if provided
function findDuplicateClient(name, registrationNumber) {
  for (const id in store.clients) {
    const c = store.clients[id];
    if (registrationNumber && c.registrationNumber === registrationNumber) return c;
    if (c.clientName && c.clientName.toLowerCase() === (name || '').toLowerCase()) return c;
  }
  return null;
}

// POST /api/ingest - Data Ingestion and Sync
// Accepts JSON payload with a "client" object and optional "dossier" object.
// Validates required fields and returns created/updated records + audit entries.
app.post('/api/ingest', async (req, res) => {
  try {
    const payload = req.body || {};
    const clientIn = payload.client || {};
    const dossierIn = payload.dossier || {};

    // Basic validation per module rules
    const missing = [];
    if (!clientIn.clientName) missing.push('client.clientName');
    if (!clientIn.primaryContact) missing.push('client.primaryContact');
    if (!clientIn.industry) missing.push('client.industry');
    if (!dossierIn.companyOverview) missing.push('dossier.companyOverview');

    if (missing.length) {
      return res.status(400).json({ error: 'Missing required fields', missing });
    }

    // Duplicate check
    const dup = findDuplicateClient(clientIn.clientName, clientIn.registrationNumber);
    let duplicate = false;
    let clientRecord;
    if (dup) {
      duplicate = true;
      clientRecord = Object.assign({}, dup);
    } else {
      const clientId = genId('Client');
      clientRecord = {
        clientId,
        clientName: clientIn.clientName,
        legalName: clientIn.legalName || null,
        registrationNumber: clientIn.registrationNumber || null,
        incorporationDate: clientIn.incorporationDate || null,
        industry: clientIn.industry,
        region: clientIn.region || null,
        revenueRange: clientIn.revenueRange || null,
        parentCompany: clientIn.parentCompany || null,
        status: clientIn.status || 'Lead', // default to Lead
        createdBy: clientIn.createdBy || 'system',
        updatedBy: clientIn.createdBy || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mdmLink: clientIn.mdmLink || null
      };
      store.clients[clientRecord.clientId] = clientRecord;

      // Audit: create
      store.auditTrail.push({
        id: genId('Audit'),
        entity: 'Client',
        entityId: clientRecord.clientId,
        action: 'Create',
        user: clientRecord.createdBy,
        timestamp: new Date().toISOString(),
        snapshotHash: snapshotHash(clientRecord)
      });
    }

    // Create dossier record
    const dossierId = genId('Dossier');
    const dossierRecord = {
      dossierId,
      clientId: clientRecord.clientId,
      companyOverview: dossierIn.companyOverview,
      industryUnderstanding: dossierIn.industryUnderstanding || null,
      strategicInitiatives: dossierIn.strategicInitiatives || null,
      keyCustomers: dossierIn.keyCustomers || [],
      locations: dossierIn.locations || [],
      keyRisks: dossierIn.keyRisks || [],
      versionStatus: dossierIn.versionStatus || 'Draft', // Draft -> Submitted -> TL Approved -> Locked
      attachments: dossierIn.attachments || [],
      createdBy: dossierIn.createdBy || clientRecord.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.dossiers[dossierId] = dossierRecord;

    store.auditTrail.push({
      id: genId('Audit'),
      entity: 'Dossier',
      entityId: dossierId,
      action: 'Create',
      user: dossierRecord.createdBy,
      timestamp: new Date().toISOString(),
      snapshotHash: snapshotHash(dossierRecord)
    });

    // Auto-create assignment if dossier approved/locked and client active
    let assignmentRecord = null;
    if ((dossierRecord.versionStatus === 'TL Approved' || dossierRecord.versionStatus === 'Locked')
        && clientRecord.status === 'Active') {
      const assignmentId = genId('Assignment');
      assignmentRecord = {
        assignmentId,
        clientId: clientRecord.clientId,
        title: `Pitch for ${clientRecord.clientName}`,
        description: dossierIn.assignmentDescription || null,
        assignedTL: dossierIn.assignedTL || null,
        startDate: dossierIn.startDate || null,
        estimatedEffort: dossierIn.estimatedEffort || null,
        confidenceLevel: dossierIn.confidenceLevel || null,
        status: 'Proposed',
        createdAt: new Date().toISOString()
      };
      store.assignments[assignmentId] = assignmentRecord;

      store.auditTrail.push({
        id: genId('Audit'),
        entity: 'Assignment',
        entityId: assignmentId,
        action: 'AutoCreate',
        user: 'system',
        timestamp: new Date().toISOString(),
        snapshotHash: snapshotHash(assignmentRecord)
      });
    }

    // Knowledge snapshot when TL Approved or Locked
    let knowledgeSnapshot = null;
    if (dossierRecord.versionStatus === 'Locked' || dossierRecord.versionStatus === 'TL Approved') {
      knowledgeSnapshot = {
        clientId: clientRecord.clientId,
        dossierId: dossierRecord.dossierId,
        snapshotHash: snapshotHash({ client: clientRecord, dossier: dossierRecord }),
        createdAt: new Date().toISOString()
      };

      store.auditTrail.push({
        id: genId('Audit'),
        entity: 'Dossier',
        entityId: dossierRecord.dossierId,
        action: 'LockSnapshot',
        user: dossierRecord.createdBy,
        timestamp: new Date().toISOString(),
        snapshotHash: knowledgeSnapshot.snapshotHash
      });
    }

    // Persist store to disk for demo
    await saveStore();

    return res.json({
      duplicate,
      client: clientRecord,
      dossier: dossierRecord,
      assignment: assignmentRecord,
      knowledgeSnapshot,
      recentAudit: store.auditTrail.slice(-5)
    });
  } catch (err) {
    console.error('Ingest error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Simple endpoint to view in-memory store (for demo)
app.get('/api/debug/store', (req, res) => {
  res.json(store);
});

const PORT = process.env.PORT || 3000;
loadStore().then(() => {
  app.listen(PORT, () => {
    console.log(`Module1 ingest server running on http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}/index.html`);
  });
});