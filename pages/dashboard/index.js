import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setUser(profile);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function viewPublicProfile() {
    if (user?.username) {
      window.open(`/${user.username}`, '_blank');
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#7c3aed',
          margin: 0,
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Munchies Art Club
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={viewPublicProfile}
            style={{
              padding: '10px 20px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'all 0.2s ease'
            }}
          >
            View Public Profile →
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Welcome back, {user?.name || 'Artist'} !
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666666',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Username: @{user?.username}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '12px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Profile
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666666',
              marginBottom: '24px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Manage your artist profile and contact information
            </p>
            <button
              onClick={() => router.push('/dashboard/profile')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                width: '100%'
              }}
            >
              Edit Profile
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '12px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Artworks
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666666',
              marginBottom: '24px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Upload and manage your artwork portfolio
            </p>
            <button
              onClick={() => router.push('/dashboard/artworks')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                width: '100%'
              }}
            >
              Manage Artworks
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '12px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              News
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#666666',
              marginBottom: '24px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Share updates and announcements
            </p>
            <button
              onClick={() => router.push('/dashboard/news')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                width: '100%'
              }}
            >
              Manage News
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '12px',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            Your Public Microsite
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#7c3aed',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600'
          }}>
            munchiesart.club/{user?.username}
          </p>
        </div>
      </main>
    </div>
  );
}
