const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'blogdb',
    password: '1234', // Ensure this password is correct
    port: 5432,
});

client.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Database connection error:", err.stack));

module.exports = client;
