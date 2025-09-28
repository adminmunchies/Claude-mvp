import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function NewsDirectory() {
  const [allNews, setAllNews] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllNews();
  }, []);

  async function loadAllNews() {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select(`
          *,
          users (name, username, profile_image_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const newsData = data || [];
      setAllNews(newsData);
      
      // Erstes Post als Featured
      if (newsData.length > 0) {
        setFeaturedPost(newsData[0]);
        setOtherPosts(newsData.slice(1));
      }

    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading news...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', fontWeight: 'bold' }}>
          Latest News
        </h1>
        <p style={{ fontSize: '20px', opacity: '0.9' }}>
          Updates and announcements from our featured artists
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* Featured Post - Full Header */}
        {featuredPost && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            overflow: 'hidden',
            marginBottom: '60px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            {featuredPost.featured_image_url && (
              <img 
                src={featuredPost.featured_image_url} 
                alt={featuredPost.title}
                style={{ 
                  width: '100%', 
                  height: '400px', 
                  objectFit: 'cover' 
                }}
              />
            )}
            
            <div style={{ padding: '40px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                {featuredPost.users?.profile_image_url && (
                  <img 
                    src={featuredPost.users.profile_image_url} 
                    alt={featuredPost.users.name}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%',
                      marginRight: '15px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div>
                  <Link 
                    href={`/${featuredPost.users?.username}`}
                    style={{ textDecoration: 'none', color: '#8a2be2', fontWeight: 'bold' }}
                  >
                    {featuredPost.users?.name}
                  </Link>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                    {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <h2 style={{ 
                fontSize: '32px', 
                marginBottom: '20px',
                lineHeight: '1.3'
              }}>
                {featuredPost.title}
              </h2>
              
              <div style={{ 
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#555',
                marginBottom: '30px'
              }}>
                {featuredPost.content.split('\n').map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '15px' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <Link 
                href={`/news/${featuredPost.id}`}
                style={{
                  background: '#8a2be2',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Read Full Post →
              </Link>
            </div>
          </div>
        )}

        {/* Other Posts - 3 Cards Grid */}
        {otherPosts.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              More News
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {otherPosts.map(post => (
                <Link 
                  key={post.id} 
                  href={`/news/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}>
                    {post.featured_image_url && (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover' 
                        }}
                      />
                    )}
                    
                    <div style={{ padding: '20px' }}>
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
                          <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#8a2be2' }}>
                            {post.users?.name}
                          </p>
                          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                            {new Date(post.published_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h3 style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '18px',
                        lineHeight: '1.3'
                      }}>
                        {post.title}
                      </h3>
                      
                      <p style={{ 
                        margin: '0', 
                        color: '#555', 
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {post.content.substring(0, 120)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {allNews.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px',
            color: '#666'
          }}>
            <h2>No news posts yet</h2>
            <p>Check back soon for updates from our artists!</p>
          </div>
        )}
      </div>
    </div>
  );
}
