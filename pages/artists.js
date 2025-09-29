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
      background: '#f8f9fa',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#2d3748', 
          fontSize: '42px', 
          textAlign: 'center',
          marginBottom: '50px',
          fontWeight: '600',
          letterSpacing: '-0.025em'
        }}>
          Featured Artists
        </h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {artists.map(artist => (
            <Link key={artist.id} href={`/${artist.username}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}>
                
                {/* Header Banner */}
                {artist.header_banner_url && (
                  <div style={{ 
                    width: '100%', 
                    height: '180px',
                    background: `url(${artist.header_banner_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}
                
                <div style={{ padding: '24px' }}>
                  {/* Profile Section */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    {artist.profile_image_url && (
                      <img 
                        src={artist.profile_image_url} 
                        alt={artist.name}
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: '16px',
                          border: '2px solid #f7fafc'
                        }}
                      />
                    )}
                    <div>
                      <h3 style={{ 
                        margin: '0', 
                        fontSize: '18px', 
                        color: '#2d3748',
                        fontWeight: '600',
                        lineHeight: '1.3'
                      }}>
                        {artist.name}
                      </h3>
                      <p style={{ 
                        margin: '2px 0 0 0', 
                        color: '#718096', 
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        @{artist.username}
                      </p>
                    </div>
                  </div>
                  
                  {artist.location && (
                    <p style={{ 
                      color: '#718096', 
                      fontSize: '14px', 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '6px' }}>📍</span>
                      {artist.location}
                    </p>
                  )}
                  
                  {artist.bio_short && (
                    <p style={{ 
                      color: '#4a5568', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      margin: '0 0 16px 0'
                    }}>
                      {artist.bio_short}
                    </p>
                  )}
                  
                  {/* Links */}
                  <div style={{ 
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {artist.website_url && (
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#4a5568',
                        background: '#f7fafc',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        🌐 Website
                      </span>
                    )}
                    {artist.instagram_handle && (
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#4a5568',
                        background: '#f7fafc',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        📸 Instagram
                      </span>
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
            color: '#718096', 
            fontSize: '16px',
            marginTop: '60px'
          }}>
            No artists found. Be the first to join!
          </div>
        )}
      </div>
    </div>
  );
}
