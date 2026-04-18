/**
 * Database Migration Script
 * Creates all tables from schema.sql
 */
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
require('dotenv').config();

async function migrate() {
  console.log('Running database migration...');
  
  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  const connection = await pool.getConnection();
  
  try {
    for (const stmt of statements) {
      try {
        await connection.query(stmt);
        // Extract table name for logging
        const match = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
        if (match) {
          console.log(`  ✓ Table '${match[1]}' ready`);
        }
      } catch (err) {
        console.error(`  ✗ Error executing statement:`, err.message);
        console.error(`    Statement: ${stmt.substring(0, 80)}...`);
      }
    }
    
    // ALTER TABLE for existing deployments
    const alters = [
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS bet_limit_step_pct TINYINT DEFAULT 50",
      "ALTER TABLE room_teams ADD COLUMN IF NOT EXISTS name_set_by VARCHAR(42) NULL",
    ];
    for (const stmt of alters) {
      try {
        await connection.query(stmt);
        console.log(`  ✓ ALTER: ${stmt.substring(0, 60)}...`);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') console.error(`  ✗ ALTER failed: ${err.message}`);
      }
    }

    console.log('\nMigration complete!');
  } finally {
    connection.release();
  }

  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
