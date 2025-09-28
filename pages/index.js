import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Homepage() {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomepageData();
  }, []);

  async function loadHomepageData() {
    try {
      // Load featured news
      const { data: newsData } = await supabase
        .from('news_posts')
        .select(`
          *,
          users (name, username, profile_image_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      setFeaturedNews(newsData || []);

      // Load featured artists
      const { data: artistsData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setFeaturedArtists(artistsData || []);

    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
          Munchies Art Club
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: '0.9' }}>
          Discover emerging artists and their latest works
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/artists" style={{
            background: 'white',
            color: '#8a2be2',
            padding: '15px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Browse Artists
          </Link>
          <Link href="/signup" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            border: '2px solid white'
          }}>
            Join as Artist
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Featured Artists Section */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '40px' }}>
            Featured Artists
          </h2>
          
          {featuredArtists.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {featuredArtists.map(artist => (
                <Link key={artist.id} href={`/${artist.username}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    {artist.profile_image_url && (
                      <img 
                        src={artist.profile_image_url} 
                        alt={artist.name}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover' 
                        }}
                      />
                    )}
                    
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>
                        {artist.name}
                      </h3>
                      <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                        @{artist.username}
                      </p>
                      {artist.bio_short && (
                        <p style={{ 
                          margin: '0', 
                          color: '#555', 
                          fontSize: '14px',
                          lineHeight: '1.4'
                        }}>
                          {artist.bio_short}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#666' }}>
              No featured artists yet. Be the first to join!
            </div>
          )}
        </section>

        {/* Latest News Section */}
        <section>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <h2 style={{ fontSize: '32px', margin: '0' }}>
              Latest News
            </h2>
            <Link href="/news" style={{
              color: '#8a2be2',
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              View All →
            </Link>
          </div>
          
          {featuredNews.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {featuredNews.map(post => (
                <div key={post.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  {post.featured_image_url && (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      style={{ 
                        width: '100%', 
                        height: '180px', 
                        objectFit: 'cover' 
                      }}
                    />
                  )}
                  
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                      {post.title}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      {post.users?.profile_image_url && (
                        <img 
                          src={post.users.profile_image_url} 
                          alt={post.users.name}
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            borderRadius: '50%',
                            marginRight: '10px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <div>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
                          {post.users?.name}
                        </p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                        </p>
                      </div>
                    </div>
                    
                    <p style={{ 
                      margin: '0', 
                      color: '#555', 
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {post.content.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#666',
              padding: '40px',
              background: '#f9f9f9',
              borderRadius: '15px'
            }}>
              <h3>No news yet!</h3>
              <p>Artists will share their latest updates here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
