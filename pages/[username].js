import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SEOHead from '../components/SEOHead'

export default function ArtistProfile() {
  const router = useRouter()
  const { username } = router.query
  const [artist, setArtist] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!username) return

    setTimeout(() => {
      if (username === 'koslitsch' || username === 'dominique') {
        setArtist({
          name: 'Dominique Foertig',
          username: username,
          bio: 'Contemporary artist exploring digital and traditional mediums. Based in Vienna, Austria.',
          website: 'https://example.com',
          instagram: '@dominique_art',
          avatar: 'https://picsum.photos/400/400?random=1'
        })
        
        setArtworks([
          {
            id: 1,
            title: 'Digital Dreams',
            description: 'Mixed media exploration of digital consciousness',
            image: 'https://picsum.photos/400/300?random=1'
          },
          {
            id: 2,
            title: 'Urban Landscapes', 
            description: 'Street photography series from Vienna',
            image: 'https://picsum.photos/400/300?random=2'
          }
        ])
        
        setNews([
          {
            id: 1,
            title: 'New Exhibition Opening Soon',
            content: 'Excited to announce my upcoming solo exhibition at Gallery Modern. Opening reception March 15th.',
            image_url: 'https://picsum.photos/600/300?random=10',
            link_url: 'https://gallery-modern.com/dominique-exhibition',
            created_at: '2024-01-20'
          }
        ])
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }, 500)
  }, [username])

  if (loading) {
    return (
      <>
        <SEOHead 
          title="Loading Artist Profile..."
          noIndex={true}
        />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Loading...</h1>
        </div>
      </>
    )
  }

  if (notFound) {
    return (
      <>
        <SEOHead 
          title="Artist Not Found | Munchies Art Club"
          description="This artist profile could not be found."
          noIndex={true}
        />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Artist not found</h1>
          <p>The artist @{username} doesn't exist.</p>
        </div>
      </>
    )
  }

  const seoTitle = `${artist.name} - Contemporary Artist ${artist.bio.includes('Vienna') ? 'Vienna' : ''} | Munchies Art Club`
  const seoDescription = `${artist.bio} View ${artworks.length} artworks and latest news from ${artist.name}.`
  const keywords = `${artist.name}, contemporary art, Vienna artist, digital art, ${artworks.map(a => a.title).join(', ')}`

  return (
    <>
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        author={artist.name}
        url={`/${artist.username}`}
        image={artist.avatar}
        type="profile"
      />
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '60px 40px', 
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>
            {artist.name}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9333ea', margin: '0 0 20px 0' }}>
            @{artist.username}
          </p>
          <p style={{ fontSize: '1.1rem', color: '#374151', maxWidth: '600px', margin: '0 auto 30px auto' }}>
            {artist.bio}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href={artist.website} target="_blank" style={{
              padding: '12px 24px',
              backgroundColor: '#9333ea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}>
              Website
            </a>
            <a href="https://instagram.com/dominique_art" target="_blank" style={{
              padding: '12px 24px',
              backgroundColor: '#e4405f',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}>
              Instagram
            </a>
          </div>
        </div>

        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
              Artworks
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {artworks.map(artwork => (
                <div key={artwork.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '250px',
                    backgroundImage: `url(${artwork.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{artwork.title}</h3>
                    <p style={{ color: '#6b7280', margin: 0 }}>{artwork.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
              Latest News
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {news.map(article => (
                <article key={article.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  marginBottom: '30px',
                  overflow: 'hidden'
                }}>
                  {article.image_url && (
                    <div style={{
                      height: '200px',
                      backgroundImage: `url(${article.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                  )}
                  
                  <div style={{ padding: '30px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>
                      {article.title}
                    </h3>
                    <p style={{ margin: '0 0 15px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p style={{ 
                      color: '#374151', 
                      lineHeight: '1.6', 
                      margin: '0 0 20px 0',
                      fontSize: '1rem'
                    }}>
                      {article.content}
                    </p>
                    
                    {article.link_url && (
                      <a 
                        href={article.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          backgroundColor: '#9333ea',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}
                      >
                        Read More
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
