import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ArtistProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (username && username !== '') {
      loadArtistData();
    }
  }, [username]);

  async function loadArtistData() {
    try {
      const { data: artistData, error: artistError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (artistError) {
        setLoading(false);
        return;
      }
      
      setArtist(artistData);

      // Load artworks
      const { data: artworksData } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', artistData.id)
        .order('sort_order', { ascending: true });

      setArtworks(artworksData || []);

      // Load news posts
      const { data: newsData } = await supabase
        .from('news_posts')
        .select('*')
        .eq('user_id', artistData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      setNews(newsData || []);

    } catch (error) {
      console.error('Error loading artist:', error);
    } finally {
      setLoading(false);
    }
  }

  function openLightbox(index) {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function nextImage() {
    setCurrentImageIndex((prev) => 
      prev === artworks.length - 1 ? 0 : prev + 1
    );
  }

  function prevImage() {
    setCurrentImageIndex((prev) => 
      prev === 0 ? artworks.length - 1 : prev - 1
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  if (!router.isReady) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading router...</div>;
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading artist...</div>;
  }
  
  if (!artist) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Artist not found</h1>
        <p>The artist @{username} doesn't exist.</p>
        <Link href="/artists">← Back to Artists</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header Banner */}
      {artist.header_banner_url && (
        <div style={{ 
          height: '300px', 
          backgroundImage: `url(${artist.header_banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px'
          }}>
            <h1 style={{ margin: '0', fontSize: '28px' }}>{artist.name}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>@{artist.username}</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Profile Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            {artist.profile_image_url && (
              <img 
                src={artist.profile_image_url} 
                alt={artist.name}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '20px'
                }}
              />
            )}
            <div>
              <h2 style={{ margin: '0', fontSize: '24px' }}>{artist.name}</h2>
              {artist.location && (
                <p style={{ margin: '5px 0', color: '#666' }}>📍 {artist.location}</p>
              )}
            </div>
          </div>

          {artist.bio_long && (
            <div style={{ marginBottom: '20px' }}>
              <h3>About</h3>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{artist.bio_long}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            {artist.website_url && (
              <a href={artist.website_url} target="_blank" rel="noopener noreferrer"
                style={{ 
                  background: '#8a2be2', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                🌐 Website
              </a>
            )}
            {artist.instagram_handle && (
              <a href={`https://instagram.com/${artist.instagram_handle}`} target="_blank" rel="noopener noreferrer"
                style={{ 
                  background: '#E4405F', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                📸 Instagram
              </a>
            )}
            {artist.contact_email && (
              <a href={`mailto:${artist.contact_email}`}
                style={{ 
                  background: '#333', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                ✉️ Contact
              </a>
            )}
          </div>
        </div>

        {/* Artworks Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Artworks ({artworks.length})</h3>
          {artworks.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {artworks.map((artwork, index) => (
                <div 
                  key={artwork.id} 
                  onClick={() => openLightbox(index)}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseOver={(e) => e.target.closest('div').style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.closest('div').style.transform = 'scale(1)'}
                >
                  {artwork.image_url && (
                    <img 
                      src={artwork.image_url} 
                      alt={artwork.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{artwork.title}</h4>
                    {artwork.year_created && (
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        {artwork.year_created}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No artworks uploaded yet.</p>
          )}
        </div>

        {/* News Section */}
        <div style={{ 
          background: 'white', 
          borderRadius: '15px', 
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Latest News ({news.length})</h3>
          {news.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {news.map(post => (
                <Link 
                  key={post.id} 
                  href={`/news/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    border: '1px solid #eee',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    height: '100%'
                  }}>
                    {post.featured_image_url && (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                        {post.title}
                      </h4>
                      <p style={{ 
                        margin: '0 0 10px 0', 
                        color: '#555', 
                        fontSize: '14px',
                        lineHeight: '1.4'
                      }}>
                        {post.content.substring(0, 100)}...
                      </p>
                      <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
                        {new Date(post.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No news posted yet.</p>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/artists" style={{
            background: '#8a2be2',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontSize: '16px'
          }}>
            ← Back to All Artists
          </Link>
        </div>
      </div>

      {/* Lightbox Modal für Artworks */}
      {lightboxOpen && artworks.length > 0 && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 1001
            }}
          >
            ×
          </button>

          {artworks.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 1001
                }}
              >
                ‹
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 1001
                }}
              >
                ›
              </button>
            </>
          )}

          <div 
            style={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={artworks[currentImageIndex]?.image_url}
              alt={artworks[currentImageIndex]?.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
            
            <div style={{
              marginTop: '20px',
              textAlign: 'center',
              color: 'white',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '15px',
              borderRadius: '10px',
              maxWidth: '500px'
            }}>
              <h3 style={{ margin: '0 0 5px 0' }}>
                {artworks[currentImageIndex]?.title}
              </h3>
              {artworks[currentImageIndex]?.year_created && (
                <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>
                  {artworks[currentImageIndex].year_created}
                </p>
              )}
              {artworks[currentImageIndex]?.medium && (
                <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>
                  {artworks[currentImageIndex].medium}
                </p>
              )}
              {artworks[currentImageIndex]?.description && (
                <p style={{ margin: '10px 0 0 0', color: '#eee', fontSize: '14px' }}>
                  {artworks[currentImageIndex].description}
                </p>
              )}
              {artworks.length > 1 && (
                <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
                  {currentImageIndex + 1} of {artworks.length} • Use arrow keys or buttons to navigate
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
