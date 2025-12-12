@echo off
echo Testing Database Connection...
echo.

cd backend
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing connection with these settings:');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('Port:', process.env.DB_PORT || 3307);
    console.log('User:', process.env.DB_USER || 'root');
    console.log('Database:', process.env.DB_NAME || 'webbrowser_ratings');
    console.log('');
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3307,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'webbrowser_ratings',
            insecureAuth: true
        });
        
        console.log('✅ SUCCESS: Connected to database!');
        
        // List tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📊 Tables found:', tables.length);
        tables.forEach(table => {
            console.log('   -', Object.values(table)[0]);
        });
        
        // Count records
        const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
        console.log('👤 Sample users:', users[0].count);
        
        await connection.end();
        console.log('\n🎉 Database is ready!');
        
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\n🔧 Check these:');
        console.log('   1. Is HeidiSQL connected to the same database?');
        console.log('   2. Are the credentials in backend/.env correct?');
        console.log('   3. Is MySQL/MariaDB service running?');
        console.log('   4. Try connecting in HeidiSQL first to verify');
    }
}

testConnection();
"

echo.
pause