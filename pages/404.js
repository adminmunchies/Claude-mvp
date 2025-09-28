import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Custom404() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: isMobile ? '30px 20px' : '40px',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: isMobile ? '6rem' : '8rem',
          fontWeight: 'bold',
          color: '#9333ea',
          marginBottom: '20px',
          lineHeight: '1'
        }}>
          404
        </div>
        <h2 style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem',
          marginBottom: '15px',
          color: '#1f2937'
        }}>
          Page Not Found
        </h2>
        <p style={{ 
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5',
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}>
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <Link 
            href="/"
            style={{
              backgroundColor: '#9333ea',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Go Home
          </Link>
          <Link 
            href="/artists"
            style={{
              border: '2px solid #9333ea',
              color: '#9333ea',
              padding: '10px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Browse Artists
          </Link>
        </div>
        
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Looking for an artist? Try searching in our{' '}
            <Link href="/artists" style={{ color: '#9333ea', textDecoration: 'none' }}>
              artist directory
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
