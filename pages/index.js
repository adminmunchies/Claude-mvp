import Link from 'next/link'
import { useState, useEffect } from 'react'
import MobileNav from '../components/MobileNav'
import SEOHead from '../components/SEOHead'

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [recentNews] = useState([
    {
      id: 1,
      artist: 'Dominique Foertig',
      username: 'koslitsch',
      title: 'New Exhibition Opening',
      content: 'Excited to announce my upcoming solo exhibition at Gallery Modern. Opening reception March 15th.',
      image: 'https://picsum.photos/400/200?random=10',
      created_at: '2024-01-20'
    }
  ])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <SEOHead 
        title="Munchies Art Club - Professional Artist Platform & Microsites"
        description="Professional microsites for artists. Showcase your work, share your story, connect with collectors. Join Vienna's premier artist community."
        keywords="artist platform, art microsites, Vienna artists, contemporary art, digital portfolio, artist community"
        url="/"
        image="/og-homepage.png"
      />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {isMobile && <MobileNav />}

        <div style={{ 
          background: 'linear-gradient(135deg, #9333ea, #2563eb)', 
          padding: isMobile ? '60px 20px' : '80px 40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: isMobile ? '2.5rem' : '4rem', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            lineHeight: isMobile ? '1.2' : '1.1'
          }}>
            Munchies Art Club
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1.1rem' : '1.3rem', 
            marginBottom: '40px', 
            maxWidth: '600px', 
            margin: '0 auto 40px auto',
            padding: isMobile ? '0 20px' : '0'
          }}>
            Professional microsites for artists. Showcase your work, share your story, connect with collectors.
          </p>
          
          {!isMobile && (
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/artists" style={{ 
                backgroundColor: 'white', color: '#9333ea', padding: '15px 30px', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
              }}>
                Discover Artists
              </Link>
              <Link href="/login" style={{ 
                backgroundColor: 'white', color: '#9333ea', padding: '15px 30px', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
              }}>
                Artist Login
              </Link>
              <Link href="/signup" style={{ 
                border: '2px solid white', color: 'white', padding: '13px 30px', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
              }}>
                Join as Artist
              </Link>
            </div>
          )}

          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
              <Link href="/artists" style={{ 
                backgroundColor: 'white', color: '#9333ea', padding: '15px', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
              }}>
                Discover Artists
              </Link>
              <Link href="/login" style={{ 
                border: '2px solid white', color: 'white', padding: '13px', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
              }}>
                Artist Login
              </Link>
            </div>
          )}
        </div>

        <div style={{ 
          padding: isMobile ? '40px 20px' : '60px 40px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '40px', 
            fontSize: isMobile ? '2rem' : '2.5rem' 
          }}>
            Latest from Artists
          </h2>
          
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            display: 'grid',
            gap: isMobile ? '20px' : '30px'
          }}>
            {recentNews.map(news => (
              <div key={news.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {news.image && (
                  <div style={{
                    height: isMobile ? '200px' : '250px',
                    backgroundImage: `url(${news.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                )}
                <div style={{ padding: isMobile ? '20px' : '30px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <Link href={`/${news.username}`} style={{ textDecoration: 'none' }}>
                      <span style={{ color: '#9333ea', fontWeight: 'bold' }}>@{news.username}</span>
                    </Link>
                    <span style={{ 
                      color: '#9ca3af', 
                      marginLeft: '10px', 
                      fontSize: '0.9rem',
                      display: isMobile ? 'block' : 'inline',
                      marginTop: isMobile ? '5px' : '0'
                    }}>
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: isMobile ? '1.2rem' : '1.4rem',
                    lineHeight: '1.3'
                  }}>
                    {news.title}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    lineHeight: '1.6',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    {news.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
