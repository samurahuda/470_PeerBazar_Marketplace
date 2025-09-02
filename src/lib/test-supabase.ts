import { supabase } from './supabase'

export async function testConnection() {
  try {
    // Test the connection by checking auth status
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('Connection test result:', error.message)
      return { success: false, error }
    } else {
      console.log('✅ Supabase connection successful!')
      return { success: true, error: null }
    }
  } catch (err) {
    console.log('❌ Connection failed:', err)
    return { success: false, error: err }
  }
}

export async function testDatabaseAccess() {
  try {
    // Simple test - this will fail gracefully if no tables exist
    const { error } = await supabase.rpc('ping')
    
    if (error && error.message.includes('function ping() does not exist')) {
      // This is expected - means we can reach the database but ping function doesn't exist
      return { success: true, message: 'Database accessible (no ping function, but that\'s normal)' }
    } else if (error) {
      return { success: false, error }
    } else {
      return { success: true, message: 'Database fully accessible' }
    }
  } catch (err) {
    return { success: false, error: err }
  }
}
