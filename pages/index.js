import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: artists, error: artistsError } = await supabase
        .from('users')
        .select('*')
        .eq('account_status', 'active')
        .limit(6);

      if (artistsError) throw artistsError;
      setFeaturedArtists(artists || []);

      const { data: news, error: newsError } = await supabase
        .from('news_posts')
        .select('*, users (name, username, profile_image_url)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(9);

      if (newsError) throw newsError;
      setLatestNews(news || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      
      <style jsx>{`
        .mc-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
          will-change: transform;
        }
        .mc-card:hover {
          box-shadow: 0 12px 28px rgba(0,0,0,0.16);
          transform: translateY(-2px);
        }
        .mc-card__media {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #f4f4f5;
        }
        @media (max-width: 1024px) {
          .mc-card__media { height: 200px; }
        }
        @media (max-width: 640px) {
          .mc-card__media { height: 160px; }
        }
        .mc-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 0.6s ease;
          will-change: transform;
        }
        .mc-card:hover .mc-card__media img {
          transform: scale(1.06);
        }
        .mc-gradient {
          position: absolute;
          inset: auto 0 0 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%);
          pointer-events: none;
        }
        .mc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          background: #111;
          padding: 6px 10px;
          border-radius: 999px;
        }
        .mc-badge-news {
          background: #0a66ff;
        }
        @media (prefers-reduced-motion: reduce) {
          .mc-card, .mc-card__media img { transition: none; }
          .mc-card:hover { transform: none; }
        }
      `}</style>

      <section style={{ background: 'white', padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '15px', color: '#000', letterSpacing: '-1px' }}>
          Munchies Art Club
        </h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '35px', fontWeight: '400' }}>
          Discover emerging artists and their latest works
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/artists" style={{ padding: '14px 32px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            Browse Artists
          </Link>
          <Link href="/signup" style={{ padding: '14px 32px', background: 'transparent', color: '#000', border: '2px solid #000', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            Join as Artist
          </Link>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
        
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', color: '#000' }}>
            New Artists to Discover
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredArtists.map(artist => (
              <article key={artist.id} className="mc-card" data-label="artist">
                <Link href={'/' + artist.username} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                  <div className="mc-card__media">
                    {artist.header_banner_url && (
                      <img src={artist.header_banner_url} alt={artist.name} loading="lazy" />
                    )}
                    <span className="mc-badge">Artist</span>
                    <span className="mc-gradient"></span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', lineHeight: '1.3', fontWeight: '700', margin: '12px 16px 4px', color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {artist.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      {artist.profile_image_url && (
                        <img src={artist.profile_image_url} alt={artist.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        @{artist.username}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>View</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', color: '#000' }}>
            Latest News
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {latestNews.map(post => (
              <article key={post.id} className="mc-card" data-label="news">
                <Link href={'/news/' + post.id} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                  <div className="mc-card__media">
                    {post.featured_image_url && (
                      <img src={post.featured_image_url} alt={post.title} loading="lazy" />
                    )}
                    <span className="mc-badge mc-badge-news">News</span>
                    <span className="mc-gradient"></span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', lineHeight: '1.3', fontWeight: '700', margin: '12px 16px 4px', color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      {post.users?.profile_image_url && (
                        <img src={post.users.profile_image_url} alt={post.users.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.users?.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>Read more</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
