// Test database connection and table setup
import { supabase } from './lib/supabase.js'

async function testDatabaseConnection() {
  console.log('Testing Supabase connection...')
  
  if (!supabase) {
    console.error('❌ Supabase client not initialized')
    return false
  }
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('todos').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection error:', error)
      
      if (error.code === 'PGRST116') {
        console.log('💡 Tables not found. Please run this SQL in your Supabase project:')
        console.log('File: database/schema.sql')
        console.log('Go to: https://supabase.com/dashboard/project/mymbiakcxecjjfgsasnu/sql')
      }
      
      return false
    }
    
    console.log('✅ Database connection successful')
    console.log('✅ Tables exist and are accessible')
    return true
    
  } catch (err) {
    console.error('❌ Connection test failed:', err)
    return false
  }
}

// Run the test
testDatabaseConnection()