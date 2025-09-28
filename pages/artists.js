import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function ArtistsDirectory() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('account_status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading artists...</div>;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '48px', 
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Featured Artists
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {artists.map(artist => (
            <Link key={artist.id} href={`/${artist.username}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}>
                {artist.header_banner_url && (
                  <img 
                    src={artist.header_banner_url} 
                    alt={`${artist.name} banner`}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover' 
                    }}
                  />
                )}
                
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    {artist.profile_image_url && (
                      <img 
                        src={artist.profile_image_url} 
                        alt={artist.name}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '15px'
                        }}
                      />
                    )}
                    <div>
                      <h3 style={{ margin: '0', fontSize: '20px', color: '#333' }}>
                        {artist.name}
                      </h3>
                      <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                        @{artist.username}
                      </p>
                    </div>
                  </div>
                  
                  {artist.location && (
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>
                      📍 {artist.location}
                    </p>
                  )}
                  
                  {artist.bio_short && (
                    <p style={{ 
                      color: '#555', 
                      fontSize: '14px', 
                      lineHeight: '1.4',
                      margin: '0'
                    }}>
                      {artist.bio_short}
                    </p>
                  )}
                  
                  <div style={{ 
                    marginTop: '15px',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    {artist.website_url && (
                      <span style={{ fontSize: '12px', color: '#8a2be2' }}>🌐 Website</span>
                    )}
                    {artist.instagram_handle && (
                      <span style={{ fontSize: '12px', color: '#8a2be2' }}>📸 Instagram</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {artists.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: 'white', 
            fontSize: '18px',
            marginTop: '60px'
          }}>
            No artists found. Be the first to join!
          </div>
        )}
      </div>
    </div>
  );
}
