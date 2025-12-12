// backend/database/init.js
// Database initialization script with authentication fix

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    console.log('Starting database initialization...');
    
    const connectionConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        // Fix for authentication plugin issue
        insecureAuth: true,
        authSwitchHandler: function ({pluginName, pluginData}, cb) {
            if (pluginName === 'auth_gssapi_client') {
                cb(null, Buffer.from([]));
            }
        }
    };

    let connection;
    
    try {
        // Connect to MySQL/MariaDB without selecting a database
        connection = await mysql.createConnection(connectionConfig);
        console.log('✓ Connected to database server');

        // Check if database exists
        const [databases] = await connection.execute('SHOW DATABASES LIKE ?', ['webbrowser_ratings']);
        
        if (databases.length > 0) {
            console.log('⚠ Database already exists, skipping creation');
        } else {
            // Create database
            await connection.execute('CREATE DATABASE IF NOT EXISTS webbrowser_ratings');
            console.log('✓ Created database: webbrowser_ratings');
        }

        // Use the database
        await connection.execute('USE webbrowser_ratings');
        console.log('✓ Using database: webbrowser_ratings');

        // Read and execute schema SQL
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = await fs.readFile(schemaPath, 'utf8');
        
        // Split SQL by semicolons and filter empty statements
        const statements = schemaSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`Executing ${statements.length} SQL statements...`);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                await connection.execute(statement + ';');
                console.log(`✓ [${i + 1}/${statements.length}] Table created`);
            } catch (error) {
                // Ignore "already exists" errors
                if (error.message.includes('already exists')) {
                    console.log(`⚠ [${i + 1}/${statements.length}] Table already exists`);
                } else {
                    console.error(`✗ [${i + 1}/${statements.length}] Error:`, error.message);
                }
            }
        }

        console.log('\n✅ Database initialization completed successfully!');
        console.log('\n📊 Database Summary:');
        console.log('   Database: webbrowser_ratings');
        console.log('   Tables created:');
        console.log('     - users');
        console.log('     - webpage_ratings');
        console.log('     - comments');
        console.log('     - search_history');
        console.log('\n🔧 Next steps:');
        console.log('   1. Update backend/.env with your database credentials');
        console.log('   2. Run the backend server: npm run start-backend');
        console.log('   3. Start the frontend: npm run start-frontend');
        console.log('   4. Launch Electron app: npm run start-electron');
        
    } catch (error) {
        console.error('\n❌ Database initialization failed:', error.message);
        console.log('\n🔍 Troubleshooting steps:');
        console.log('   1. Make sure MariaDB/MySQL is installed and running');
        console.log('   2. Check if port 3307 is available');
        console.log('   3. Try using HeidiSQL to connect first');
        console.log('   4. If using XAMPP/WAMP, MySQL might be on port 3306');
        console.log('   5. Create .env file from .env.example');
        console.log('\n💡 Manual setup:');
        console.log('   Run the schema.sql file manually in HeidiSQL or MySQL Workbench');
        console.log('   File location: backend/database/schema.sql');
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Run initialization
initializeDatabase();