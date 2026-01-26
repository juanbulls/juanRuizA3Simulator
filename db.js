const { Pool } = require('pg')
const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'postgres', // Public for presenting porpuses
    database: 'simulator'
})

module.exports = pool