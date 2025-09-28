import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}><h1>Loading...</h1></div>
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#9333ea' }}>Munchies Art Club</h1>
        <button onClick={handleLogout} style={{
          backgroundColor: '#ef4444', color: 'white', border: 'none',
          padding: '8px 16px', borderRadius: '5px', cursor: 'pointer'
        }}>Logout</button>
      </div>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2>Welcome back, {profile?.name || 'Artist'}!</h2>
          <p style={{ color: '#666' }}>Username: @{profile?.username || 'not-set'}</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Profile</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Manage your artist profile and contact information</p>
            <Link href="/dashboard/profile" style={{
              backgroundColor: '#9333ea', color: 'white', padding: '10px 20px',
              borderRadius: '5px', textDecoration: 'none', display: 'inline-block'
            }}>Edit Profile</Link>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Artworks</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Upload and manage your artwork portfolio</p>
            <Link href="/dashboard/artworks" style={{
              backgroundColor: '#9333ea', color: 'white', padding: '10px 20px',
              borderRadius: '5px', textDecoration: 'none', display: 'inline-block'
            }}>Manage Artworks</Link>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>News</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Share updates and announcements</p>
            <Link href="/dashboard/news" style={{
              backgroundColor: '#9333ea', color: 'white', padding: '10px 20px',
              borderRadius: '5px', textDecoration: 'none', display: 'inline-block'
            }}>Manage News</Link>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Your Public Microsite</h3>
          {profile?.username ? (
            <a href={`/${profile.username}`} target="_blank" style={{ color: '#9333ea', textDecoration: 'none' }}>
              munchiesart.club/{profile.username}
            </a>
          ) : (
            <p style={{ color: '#666' }}>Set a username in your profile to get your public microsite URL</p>
          )}
        </div>
      </div>
    </div>
  )
}
