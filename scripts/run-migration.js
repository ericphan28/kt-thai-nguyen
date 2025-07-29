/**
 * Script để chạy SQL migration cho database redesign
 * Usage: node scripts/run-migration.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filePath) {
  try {
    console.log(`📄 Running SQL file: ${filePath}`)
    const sql = fs.readFileSync(filePath, 'utf8')
    
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error(`❌ Error running ${filePath}:`, error)
      return false
    }
    
    console.log(`✅ Successfully ran ${filePath}`)
    return true
  } catch (err) {
    console.error(`❌ Error reading file ${filePath}:`, err)
    return false
  }
}

async function main() {
  console.log('🚀 Starting database migration...\n')
  
  const sqlFiles = [
    path.join(__dirname, 'sql', 'redesign-students-table.sql'),
    path.join(__dirname, 'sql', 'create-register-function.sql')
  ]
  
  let success = true
  
  for (const sqlFile of sqlFiles) {
    const result = await runSQLFile(sqlFile)
    if (!result) {
      success = false
      break
    }
    console.log('') // Empty line for readability
  }
  
  if (success) {
    console.log('🎉 Migration completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Test the student registration form')
    console.log('2. Verify that new accounts are created in auth.users')
    console.log('3. Check the login functionality')
  } else {
    console.log('❌ Migration failed. Please check the errors above.')
    process.exit(1)
  }
}

main().catch(console.error)
