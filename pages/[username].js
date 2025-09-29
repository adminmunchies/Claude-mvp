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
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

      const { data: artworksData } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', artistData.id)
        .order('sort_order', { ascending: true });

      setArtworks(artworksData || []);

      const { data: newsData } = await supabase
        .from('news_posts')
        .select('*')
        .eq('user_id', artistData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      setNews(newsData || []);

    } catch (error) {
      console.error('Error loading artist:', error);
    } finally {
      setLoading(false);
    }
  }

  // Header Navigation (bleibt unverändert)
  function nextArtwork() {
    setCurrentArtworkIndex((prev) => 
      prev === artworks.length - 1 ? 0 : prev + 1
    );
  }

  function prevArtwork() {
    setCurrentArtworkIndex((prev) => 
      prev === 0 ? artworks.length - 1 : prev - 1
    );
  }

  // Lightbox Funktionen
  function openLightbox(index) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
  }

  function nextLightboxImage() {
    setLightboxIndex((prev) => 
      prev === artworks.length - 1 ? 0 : prev + 1
    );
  }

  function prevLightboxImage() {
    setLightboxIndex((prev) => 
      prev === 0 ? artworks.length - 1 : prev - 1
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
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

  if (!router.isReady || loading) {
    return <div style={{ minHeight: '100vh', background: '#fafafa' }}></div>;
  }
  
  if (!artist) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fafafa', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '24px', color: '#2d3748', fontWeight: '400' }}>Artist not found</h1>
        <Link href="/artists" style={{ color: '#718096', textDecoration: 'none' }}>← Back to Artists</Link>
      </div>
    );
  }

  const currentArtwork = artworks[currentArtworkIndex];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      
      {/* Full-Screen Header - BLEIBT UNVERÄNDERT */}
      <div style={{ 
        height: '100vh', 
        background: currentArtwork ? `url(${currentArtwork.image_url})` : (artist.header_banner_url ? `url(${artist.header_banner_url})` : '#e2e8f0'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)'
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '40px',
          right: '40px',
          zIndex: 10,
          maxWidth: '600px'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: '300',
            margin: '0',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            {artist.name}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '18px',
            margin: '8px 0 0 0',
            fontWeight: '400'
          }}>
            @{artist.username}
          </p>
          
          {artist.bio_short && (
            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '16px',
              margin: '16px 0 0 0',
              fontWeight: '300',
              lineHeight: '1.4',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
              {artist.bio_short}
            </p>
          )}
        </div>

        {/* Header Navigation - BLEIBT UNVERÄNDERT */}
        {artworks.length > 1 && (
          <>
            <button
              onClick={prevArtwork}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                zIndex: 10
              }}
            >
              ‹
            </button>
            
            <button
              onClick={nextArtwork}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                zIndex: 10
              }}
            >
              ›
            </button>
          </>
        )}

        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '12px',
          opacity: '0.7'
        }}>
          ↓ Scroll for more
        </div>
      </div>

      {/* Content Section */}
      <div style={{ 
        background: 'white',
        padding: '60px 40px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        
        {/* Profile Details */}
        <div style={{ 
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '60px',
          gap: '24px'
        }}>
          {artist.profile_image_url && (
            <img 
              src={artist.profile_image_url} 
              alt={artist.name}
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            {artist.location && (
              <p style={{ 
                color: '#718096', 
                fontSize: '16px', 
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center'
              }}>
                📍 {artist.location}
              </p>
            )}
            
            {artist.bio_long && artist.bio_long.trim() !== '' && (
              <p style={{ 
                color: '#4a5568', 
                fontSize: '16px', 
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                {artist.bio_long}
              </p>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
              {artist.website_url && (
                <a 
                  href={artist.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#4a5568',
                    textDecoration: 'none',
                    fontSize: '14px',
                    padding: '8px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Website
                </a>
              )}
              {artist.instagram_handle && (
                <a 
                  href={artist.instagram_handle.startsWith('http') ? artist.instagram_handle : `https://instagram.com/${artist.instagram_handle}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#4a5568',
                    textDecoration: 'none',
                    fontSize: '14px',
                    padding: '8px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Current Artwork Details */}
        {currentArtwork && (
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '300',
              color: '#2d3748',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em'
            }}>
              {currentArtwork.title}
            </h2>
            
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              marginBottom: '16px',
              color: '#718096',
              fontSize: '14px'
            }}>
              {currentArtwork.year_created && <span>{currentArtwork.year_created}</span>}
              {currentArtwork.medium && <span>{currentArtwork.medium}</span>}
              {currentArtwork.dimensions && <span>{currentArtwork.dimensions}</span>}
            </div>
            
            {currentArtwork.description && (
              <p style={{
                color: '#4a5568',
                fontSize: '16px',
                lineHeight: '1.6',
                margin: '0'
              }}>
                {currentArtwork.description}
              </p>
            )}

            {artworks.length > 1 && (
              <p style={{
                color: '#718096',
                fontSize: '12px',
                margin: '20px 0 0 0'
              }}>
                {currentArtworkIndex + 1} of {artworks.length} artworks
              </p>
            )}
          </div>
        )}

        {/* Thumbnail Gallery - MIT LIGHTBOX FUNKTION */}
        {artworks.length > 1 && (
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '400',
              color: '#2d3748',
              marginBottom: '20px'
            }}>
              More Works
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {artworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  onClick={() => openLightbox(index)}  // LIGHTBOX ÖFFNEN
                  style={{
                    cursor: 'pointer',
                    opacity: index === currentArtworkIndex ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Section */}
        {news.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '400',
              color: '#2d3748',
              marginBottom: '20px'
            }}>
              Latest Updates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {news.map(post => (
                <Link 
                  key={post.id} 
                  href={`/news/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    display: 'flex',
                    gap: '16px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    
                    {post.featured_image_url && (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#2d3748',
                        margin: '0 0 8px 0'
                      }}>
                        {post.title}
                      </h4>
                      
                      <p style={{
                        fontSize: '14px',
                        color: '#4a5568',
                        margin: '0 0 8px 0',
                        lineHeight: '1.4'
                      }}>
                        {post.content.substring(0, 120)}...
                      </p>
                      
                      <p style={{
                        fontSize: '12px',
                        color: '#718096',
                        margin: '0'
                      }}>
                        {new Date(post.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
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
          {/* Close Button */}
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

          {/* Previous Button */}
          {artworks.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
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
          )}

          {/* Next Button */}
          {artworks.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
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
          )}

          {/* Main Image */}
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
              src={artworks[lightboxIndex]?.image_url}
              alt={artworks[lightboxIndex]?.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
            
            {/* Image Info */}
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
                {artworks[lightboxIndex]?.title}
              </h3>
              {artworks[lightboxIndex]?.year_created && (
                <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>
                  {artworks[lightboxIndex].year_created}
                </p>
              )}
              {artworks[lightboxIndex]?.medium && (
                <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>
                  {artworks[lightboxIndex].medium}
                </p>
              )}
              {artworks[lightboxIndex]?.description && (
                <p style={{ margin: '10px 0 0 0', color: '#eee', fontSize: '14px' }}>
                  {artworks[lightboxIndex].description}
                </p>
              )}
              {artworks.length > 1 && (
                <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '12px' }}>
                  {lightboxIndex + 1} of {artworks.length} • Use arrow keys or buttons to navigate
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
