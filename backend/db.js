import sql from 'mssql/msnodesqlv8.js';

const sqlConfig = {
    server: 'CEITCS\\SQLEXPRESS',
    database: 'PayrollDB',
    driver: 'ODBC Driver 17 for SQL Server',
    options: {
        trustedConnection: true,
        encrypt: false, // For local dev, false is usually needed, or use trustServerCertificate: true
        trustServerCertificate: true
    }
};

let poolPromise = sql.connect(sqlConfig)
    .then(pool => {
        console.log('✅ SQL Server connected to PayrollDB');
        return pool;
    })
    .catch(err => console.log('❌ SQL Database Connection Failed!', err));

export const logAdminActivity = async (message, empId = 'ADMIN') => {
    try {
        const pool = await poolPromise;
        // Check if ACTIVITYTABLE has CREATEDAT by performing a simple query or rely on defaults.
        // It has CREATEDAT/UPDATEDAT but the previous code inserted without them, so we insert without them. 
        // If it fails, that's caught in the catch block to not break the app.
        await pool.request()
            .input('emp_id', sql.VarChar, empId)
            .input('message', sql.VarChar, message)
            .query('INSERT INTO ACTIVITYTABLE (EMP_ID, MESSAGE) VALUES (@emp_id, @message)');
    } catch (err) {
        console.error("Activity Logging failed:", err.message);
    }
};

export { sql, poolPromise };
