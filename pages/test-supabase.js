import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('users').select('count')
        if (error) throw error
        setConnected(true)
      } catch (err) {
        setError(err.message)
      }
    }
    testConnection()
  }, [])

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Supabase Connection Test</h1>
      {connected && <p style={{ color: 'green' }}>✅ Connected to Supabase</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
    </div>
  )
}
