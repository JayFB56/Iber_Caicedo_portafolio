const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function initDB(config) {
  try {
    const sqlFile = path.join(__dirname, '..', 'database', 'db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Extract and run CREATE DATABASE first (if present)
    const dbMatch = sql.match(/create\s+database\s+([`\w_]+)/i);
    let dbName = (dbMatch && dbMatch[1]) ? dbMatch[1].replace(/`/g, '') : config.database;

    const conn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      multipleStatements: true
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

    // Now create a connection to the DB and run remaining statements
    const dbConn = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      database: dbName,
      multipleStatements: true
    });

    // Remove the CREATE DATABASE and any SELECT or USE statements to avoid conflicts
    let statements = sql
      .split(/;\r?\n|;\n|;/)
      .map(s => s.trim())
      .filter(s => s && !/^--/.test(s) && !s.toLowerCase().startsWith('select') && !s.toLowerCase().startsWith('create database'))
      .join(';\n');

    // Make CREATE TABLE statements idempotent
    statements = statements.replace(/create\s+table\s+/gi, 'CREATE TABLE IF NOT EXISTS ');

    if (statements) {
      const wrapped = `SET FOREIGN_KEY_CHECKS=0;\n${statements};\nSET FOREIGN_KEY_CHECKS=1;`;
      await dbConn.query(wrapped);
    }

    // Ensure tb_Usuarios password column can store bcrypt hashes and idUsuario supports alphanumeric
    try {
      await dbConn.query("ALTER TABLE tb_Usuarios MODIFY password VARCHAR(255)");
      await dbConn.query("ALTER TABLE tb_Usuarios MODIFY idUsuario VARCHAR(50) NOT NULL");
    } catch (errAlter) {
      // ignore if fails (e.g., table doesn't exist or already set)
    }
    // Ensure there is at least one user
    try {
      const [rows] = await dbConn.query('SELECT COUNT(*) as cnt FROM tb_Usuarios');
      const cnt = rows && rows[0] ? rows[0].cnt : 0;
      if (cnt === 0) {
        // Create default user: idUsuario 'root', password 'root'
        const hash = bcrypt.hashSync('root', 10);
        await dbConn.query('INSERT INTO tb_Usuarios (idUsuario, password) VALUES (?, ?)', ['admin', hash]);
        console.log("Default user created: idUsuario='root' password=root");
      }
    } catch (errInner) {
      console.warn('Could not check/insert default user: ', errInner.message || errInner);
    }

    await dbConn.end();
    await conn.end();
    console.log('Database init completed or already present');
  } catch (err) {
    console.error('Database initialization failed:', err.message || err);
    throw err;
  }
}

module.exports = initDB;
