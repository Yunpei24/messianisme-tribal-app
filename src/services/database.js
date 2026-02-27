import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('messianisme.db');

  // Participants
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_participants (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  // Sessions
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_sessions (
      id TEXT PRIMARY KEY,
      localite_activite TEXT NOT NULL,
      date_debut TEXT NOT NULL,
      date_fin TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  // Personnes témoignées
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_personnes (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenoms TEXT NOT NULL,
      date_naissance TEXT,
      situation_matrimoniale TEXT,
      partenaire_id TEXT,
      sexe TEXT,
      ville_village TEXT,
      occupation TEXT,
      numero_telephone TEXT,
      session_id TEXT NOT NULL,
      participant_id TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT,
      synced INTEGER DEFAULT 0,
      local_id TEXT,
      FOREIGN KEY (session_id) REFERENCES local_sessions(id),
      FOREIGN KEY (participant_id) REFERENCES local_participants(id),
      FOREIGN KEY (partenaire_id) REFERENCES local_personnes(id)
    );
  `);

  // Migration dynamique pour la base de données existante
  try {
    await db.execAsync("ALTER TABLE local_personnes ADD COLUMN local_id TEXT;");
  } catch (e) {
    // La colonne existe déjà
  }

  // Session participants
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_session_participants (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      participant_id TEXT NOT NULL,
      created_at TEXT,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES local_sessions(id),
      FOREIGN KEY (participant_id) REFERENCES local_participants(id)
    );
  `);

  // File de synchronisation
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      action TEXT NOT NULL,
      data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      retry_count INTEGER DEFAULT 0
    );
  `);
};

export const getDb = () => db;

export const insertLocal = async (tableName, data) => {
  if (!db) return;
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(',');

  const query = `INSERT OR REPLACE INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
  await db.runAsync(query, values);
};

export const updateLocal = async (tableName, id, data) => {
  if (!db) return;
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClauses = keys.map(k => `${k} = ?`).join(',');

  const query = `UPDATE ${tableName} SET ${setClauses} WHERE id = ?`;
  await db.runAsync(query, [...values, id]);
};

export const deleteLocal = async (tableName, id) => {
  if (!db) return;
  await db.runAsync(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
};

export const queryLocal = async (tableName, conditions = {}, order = '') => {
  if (!db) return [];
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  let query = `SELECT * FROM ${tableName}`;

  if (keys.length > 0) {
    const whereClauses = keys.map(k => `${k} = ?`).join(' AND ');
    query += ` WHERE ${whereClauses}`;
  }

  if (order) {
    query += ` ${order}`;
  }

  return await db.getAllAsync(query, values);
};

export const addToSyncQueue = async (tableName, recordId, action, data) => {
  if (!db) return;
  await db.runAsync(
    'INSERT INTO sync_queue (table_name, record_id, action, data) VALUES (?, ?, ?, ?)',
    [tableName, recordId, action, JSON.stringify(data)]
  );
};
