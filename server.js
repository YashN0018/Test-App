// Minimal Express server with one "Data Ingestion and Sync" endpoint.
// In-memory stores used for demo; replace with DB in production.

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Serve frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// In-memory stores
const store = {
  clients: {},       // clientId -> client record
  dossiers: {},      // dossierId -> dossier record
  assignments: {},   // assignmentId -> assignment record
  auditTrail: []     // array of audit entries
};

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
app.post('/api/ingest', (req, res) => // add at top of server.js
const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data.json');

// helper to load existing DB (returns array)
async function loadDataFile() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // file missing or invalid — start fresh
    return [];
  }
}

// helper to save DB (array)
async function saveDataFile(arr) {
  await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// Your existing express app and body parsing must exist e.g. app.use(express.json())

app.post('/api/ingest', async (req, res) => {
  try {
    const payload = req.body || {};

    // Very small validation (expand as needed)
    if (!payload.clientName || !payload.primaryContact) {
      return res.status(400).json({ status: 400, message: 'clientName and primaryContact required' });
    }

    // Simple “generate IDs” (you can replace with better logic)
    const ts = Date.now();
    const clientId = `Client_${ts}_${Math.floor(Math.random()*100)}`;
    const dossierId = `Dossier_${ts}_${Math.floor(Math.random()*100)}`;

    const client = {
      clientId,
      clientName: payload.clientName,
      primaryContact: payload.primaryContact,
      industry: payload.industry || null,
      status: payload.clientStatus || 'Lead',
      createdBy: 'demoUser',
      createdAt: new Date().toISOString()
    };

    const dossier = {
      dossierId,
      clientId,
      companyOverview: payload.companyOverview || '',
      versionStatus: payload.dossierVersionStatus || 'Draft',
      createdBy: 'demoUser',
      createdAt: new Date().toISOString()
    };

    // load existing data
    const store = await loadDataFile();

    // VERY SIMPLE duplicate detection (by clientName + primaryContact)
    const duplicate = store.some(item =>
      item.client && item.client.clientName === client.clientName &&
      item.client.primaryContact === client.primaryContact
    );

    // create audit entry
    const audit = {
      id: `Audit_${Date.now()}_${Math.floor(Math.random()*100)}`,
      entity: duplicate ? 'Client (duplicate)' : 'Client',
      entityId: client.clientId,
      action: duplicate ? 'DuplicateDetected' : 'Create',
      user: 'demoUser',
      timestamp: new Date().toISOString()
    };

    // object to save
    const record = { client, dossier, duplicate, audit, savedAt: new Date().toISOString() };

    // append only if you want to keep duplicates too (we will append either way)
    store.push(record);
    await saveDataFile(store);

    return res.json({ status: 200, data: record });
  } catch (err) {
    console.error('Ingest error', err);
    return res.status(500).json({ status: 500, message: 'Server error' });
  }
});

  // Duplicate check
  const dup = findDuplicateClient(clientIn.clientName, clientIn.registrationNumber);
  let duplicate = false;
  if (dup) {
    duplicate = true;
    // For demo: we do not override existing client, we return duplicate info
  }

  // Create client record (or reuse if duplicate)
  let clientRecord;
  if (duplicate) {
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
    store.clients[clientId] = clientRecord;

    // Audit: create
    store.auditTrail.push({
      id: genId('Audit'),
      entity: 'Client',
      entityId: clientId,
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

  // If dossier is TL Approved or Locked and client status becomes Active -> create assignment stub
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

  // If dossier gets Locked or TL Approved, create a snapshot hash that could be pushed to a Knowledge Hub
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

  // Response: echo created records and audit entries relevant to this request
  return res.json({
    duplicate,
    client: clientRecord,
    dossier: dossierRecord,
    assignment: assignmentRecord,
    knowledgeSnapshot,
    recentAudit: store.auditTrail.slice(-5)
  });
});

// Simple endpoint to view in-memory store (for demo)
app.get('/api/debug/store', (req, res) => {
  res.json(store);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Module1 ingest server running on http://localhost:${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}/index.html`);
});