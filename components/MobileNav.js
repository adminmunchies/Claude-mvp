import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ display: 'block' }}>
      {/* Mobile Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, color: '#9333ea', fontSize: '1.5rem' }}>
            Munchies
          </h1>
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link 
              href="/artists" 
              onClick={() => setIsOpen(false)}
              style={{
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '18px'
              }}
            >
              Discover Artists
            </Link>
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              style={{
                padding: '15px',
                backgroundColor: '#9333ea',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'white',
                fontSize: '18px',
                textAlign: 'center'
              }}
            >
              Artist Login
            </Link>
            <Link 
              href="/signup" 
              onClick={() => setIsOpen(false)}
              style={{
                padding: '15px',
                border: '2px solid #9333ea',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#9333ea',
                fontSize: '18px',
                textAlign: 'center'
              }}
            >
              Join as Artist
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
