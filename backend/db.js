const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'testuser',
    password: 'testpassword',
    host: 'localhost',
    port: '5432',
    database: 'testdb'
});


module.exports = pool;