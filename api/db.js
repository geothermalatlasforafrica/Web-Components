const { Pool } = require('pg');

const pool = new Pool({
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    ssl: process.env.PGSSLMODE === "require"
});

module.exports = { pool };
