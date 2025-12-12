@echo off
REM test_connection.bat - Test database connection
echo Testing Database Connection...
echo.

cd backend
echo Loading environment variables...
if not exist ".env" (
    echo ❌ .env file not found!
    echo Creating from template...
    copy ".env.example" ".env"
    echo ✓ Created .env file
    echo Please edit it with your database credentials
    pause
    exit /b 1
)

echo Running connection test...
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            insecureAuth: true
        });
        
        console.log('✅ Successfully connected to database server!');
        console.log('   Host:', process.env.DB_HOST);
        console.log('   Port:', process.env.DB_PORT);
        console.log('   User:', process.env.DB_USER);
        
        // Try to use the database
        await connection.execute('USE webbrowser_ratings');
        console.log('✅ Database webbrowser_ratings is accessible');
        
        // List tables
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📊 Tables found:', tables.length);
        
        await connection.end();
        return true;
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Is MySQL/MariaDB running?');
        console.log('   2. Check port in .env (3306 for XAMPP, 3307 for MariaDB)');
        console.log('   3. Verify username/password');
        console.log('   4. Try: mysql -u root -p (command line)');
        return false;
    }
}

testConnection();
"

cd ..
pause