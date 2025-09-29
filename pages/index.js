import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const { data: artistsData } = await supabase
      .from('users')
      .select('*')
      .limit(6)
      .order('created_at', { ascending: false });

    const { data: newsData } = await supabase
      .from('news_posts')
      .select('*, users(name, username, profile_image_url)')
      .eq('status', 'published')
      .eq('is_featured_on_homepage', true)
      .limit(6)
      .order('published_at', { ascending: false });

    setArtists(artistsData || []);
    setNews(newsData || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <section style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#ffffff' }}>
        <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', fontFamily: 'Montserrat, sans-serif', letterSpacing: '-1px' }}>Discover Contemporary Art</h1>
        <p style={{ fontSize: '20px', color: '#666666', marginBottom: '40px', fontFamily: 'Montserrat, sans-serif', maxWidth: '600px', margin: '0 auto 40px' }}>Selected artists and curators shaping the art world today</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/artists" style={{ padding: '16px 32px', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>Browse Artists</Link>
          <Link href="/signup" style={{ padding: '16px 32px', backgroundColor: 'transparent', color: '#000000', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif', border: '2px solid #000000' }}>Join as Artist</Link>
        </div>
      </section>

      {artists.length > 0 && (
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', fontFamily: 'Montserrat, sans-serif' }}>New Artists to Discover</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {artists.map(artist => (
              <Link key={artist.id} href={`/${artist.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  {artist.header_banner_url && (
                    <div style={{ width: '100%', height: '200px', backgroundImage: `url(${artist.header_banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      {artist.profile_image_url && (
                        <img src={artist.profile_image_url} alt={artist.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #ffffff', objectFit: 'cover', position: 'absolute', bottom: '-40px', left: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                      )}
                    </div>
                  )}
                  <div style={{ padding: '50px 20px 20px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>{artist.name}</h3>
                    {artist.location && <p style={{ fontSize: '14px', color: '#666666', marginBottom: '12px', fontFamily: 'Montserrat, sans-serif' }}>{artist.location}</p>}
                    {artist.bio_short && <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif' }}>{artist.bio_short.substring(0, 100)}...</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', fontFamily: 'Montserrat, sans-serif' }}>Latest News</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {news.map(post => (
              <Link key={post.id} href={`/news/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  {post.featured_image_url && (
                    <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 12px', backgroundColor: '#0a66ff', color: '#ffffff', fontSize: '11px', fontWeight: '700', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>News</div>
                      <img src={post.featured_image_url} alt={post.image_alt || post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', padding: '60px 20px 20px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {post.users?.profile_image_url && <img src={post.users.profile_image_url} alt={post.users.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />}
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', fontFamily: 'Montserrat, sans-serif', marginBottom: '2px' }}>{post.users?.name}</p>
                            <p style={{ fontSize: '12px', color: '#cccccc', fontFamily: 'Montserrat, sans-serif' }}>{new Date(post.published_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '20px', flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif' }}>{post.content.substring(0, 120)}...</p>
                    <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '600', color: '#000000', fontFamily: 'Montserrat, sans-serif', textAlign: 'right' }}>Read more →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
