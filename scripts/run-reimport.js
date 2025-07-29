const { config } = require('dotenv');
const path = require('path');

// Load .env.local file
config({ path: path.resolve(__dirname, '../.env.local') });

// Import and run the reimport script
require('./reimport_students.ts');
