const { Pool } = require('@neondatabase/serverless');

async function checkNeon() {
  const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_PkJ5CfMlYp8q@ep-ancient-lab-apirf4vp-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require' });
  
  try {
    const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    console.log("Tables in Neon:", res.rows.map(r => r.table_name));
    
    // Check User count
    const userRes = await pool.query('SELECT count(*) FROM "User"');
    console.log("Users in Neon:", userRes.rows[0].count);
    
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

checkNeon();
