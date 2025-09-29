import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

export default function ArtistProfile() {
  const router = useRouter();
  const { username } = router.query;
  
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (username) {
      loadArtistProfile();
      checkIfOwner();
    }
  }, [username]);

  async function checkIfOwner() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: profile } = await supabase
        .from('users')
        .select('username')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.username === username) {
        setIsOwner(true);
      }
    }
  }

  async function loadArtistProfile() {
    const { data: artistData } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (!artistData) {
      router.push('/404');
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
      .order('published_at', { ascending: false });

    setNews(newsData || []);
    setLoading(false);
  }

  function openLightbox(artwork, index) {
    setLightboxImage(artwork);
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxImage(null);
  }

  function nextImage() {
    const newIndex = (lightboxIndex + 1) % artworks.length;
    setLightboxIndex(newIndex);
    setLightboxImage(artworks[newIndex]);
  }

  function prevImage() {
    const newIndex = lightboxIndex === 0 ? artworks.length - 1 : lightboxIndex - 1;
    setLightboxIndex(newIndex);
    setLightboxImage(artworks[newIndex]);
  }

  useEffect(() => {
    function handleKeyPress(e) {
      if (!lightboxImage) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxImage, lightboxIndex]);

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

  if (!artist) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {isOwner && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100
        }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {artist.header_banner_url && (
        <div style={{
          width: '100%',
          height: '300px',
          backgroundImage: `url(${artist.header_banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          marginTop: artist.header_banner_url ? '-60px' : '60px',
          marginBottom: '24px'
        }}>
          {artist.profile_image_url && (
            <img
              src={artist.profile_image_url}
              alt={artist.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '4px solid #ffffff',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          )}
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '12px',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            {artist.name}
          </h1>
          
          {artist.location && (
            <p style={{
              fontSize: '16px',
              color: '#666666',
              marginBottom: '24px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              {artist.location}
            </p>
          )}

          {artist.bio_long && (
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#333333',
              marginBottom: '24px',
              fontFamily: 'Montserrat, sans-serif',
              maxWidth: '800px'
            }}>
              {artist.bio_long}
            </p>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
            {artist.website_url && (
              <a href={artist.website_url} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>Website</a>
            )}
            
            {artist.instagram_handle && (
              <a href={`https://instagram.com/${artist.instagram_handle}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>Instagram</a>
            )}

            {artist.contact_email && (
              <a href={`mailto:${artist.contact_email}`} style={{ padding: '10px 20px', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>Contact</a>
            )}
          </div>
        </div>

        {artworks.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '32px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Artworks
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {artworks.map((artwork, index) => (
                <div key={artwork.id} onClick={() => openLightbox(artwork, index)} style={{ cursor: 'pointer', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                    <img src={artwork.image_url} alt={artwork.alt_text || artwork.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>{artwork.title}</h3>
                    {artwork.year_created && (
                      <p style={{ fontSize: '14px', color: '#666666', fontFamily: 'Montserrat, sans-serif' }}>{artwork.year_created}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {news.length > 0 && (
          <section style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', fontFamily: 'Montserrat, sans-serif' }}>News</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {news.map(post => (
                <div key={post.id} onClick={() => router.push(`/news/${post.id}`)} style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>{post.title}</h3>
                  <p style={{ fontSize: '14px', color: '#999999', marginBottom: '12px', fontFamily: 'Montserrat, sans-serif' }}>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style={{ fontSize: '16px', color: '#666666', lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif' }}>{post.content.substring(0, 150)}...</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />

      {lightboxImage && (
        <div onClick={closeLightbox} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <button onClick={closeLightbox} style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', border: 'none', color: '#ffffff', fontSize: '40px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontWeight: '300' }}>×</button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid #ffffff', color: '#ffffff', fontSize: '24px', padding: '12px 20px', cursor: 'pointer', borderRadius: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>←</button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: '20px', backgroundColor: 'rgba(255,255,255,0.1)', border: '2px solid #ffffff', color: '#ffffff', fontSize: '24px', padding: '12px 20px', cursor: 'pointer', borderRadius: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>→</button>
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={lightboxImage.image_url} alt={lightboxImage.alt_text || lightboxImage.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', marginBottom: '20px' }} />
            <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '8px', maxWidth: '600px', textAlign: 'center' }}>
              <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>{lightboxIndex + 1} of {artworks.length}</p>
              <h3 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>{lightboxImage.title}</h3>
              {lightboxImage.year_created && <p style={{ color: '#cccccc', fontSize: '16px', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>{lightboxImage.year_created}</p>}
              {lightboxImage.medium && <p style={{ color: '#cccccc', fontSize: '14px', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>{lightboxImage.medium}</p>}
              {lightboxImage.dimensions && <p style={{ color: '#cccccc', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>{lightboxImage.dimensions}</p>}
              {lightboxImage.description && <p style={{ color: '#cccccc', fontSize: '14px', marginTop: '12px', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.6' }}>{lightboxImage.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
