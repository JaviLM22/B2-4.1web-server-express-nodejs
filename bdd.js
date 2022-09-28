const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool();

const q = async (query, parametros) => {
   const client = await pool.connect(); 
   const result = await client.query(query, parametros);
   client.release();
   return result.rows
} 

module.exports = {
    q
}