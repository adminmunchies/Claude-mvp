import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Nur Auth User erstellen, kein Profile
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      setError(authError.message)
    } else {
      setError('Check your email for verification link!')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#9333ea', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Home
      </Link>
      
      <h1>Sign Up</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' }} />
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : '#9333ea', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}
