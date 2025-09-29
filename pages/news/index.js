import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Footer from '../../components/Footer';

export default function NewsDirectory() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from('news_posts')
      .select('*, users(name, username, profile_image_url)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    setNews(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '48px', fontFamily: 'Montserrat, sans-serif' }}>News</h1>

        {news.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {news.map(post => (
              <Link key={post.id} href={`/news/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                  {post.featured_image_url && (
                    <div style={{ width: '100%', height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 12px', backgroundColor: '#0a66ff', color: '#ffffff', fontSize: '11px', fontWeight: '700', borderRadius: '6px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>News</div>
                      <img src={post.featured_image_url} alt={post.image_alt || post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px', fontFamily: 'Montserrat, sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      {post.users?.profile_image_url && <img src={post.users.profile_image_url} alt={post.users.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />}
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#000000', fontFamily: 'Montserrat, sans-serif', marginBottom: '2px' }}>{post.users?.name}</p>
                        <p style={{ fontSize: '12px', color: '#999999', fontFamily: 'Montserrat, sans-serif' }}>{new Date(post.published_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', fontFamily: 'Montserrat, sans-serif', flex: 1 }}>{post.content.substring(0, 120)}...</p>
                    <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '600', color: '#000000', fontFamily: 'Montserrat, sans-serif', textAlign: 'right' }}>Read more →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666666', fontSize: '16px', fontFamily: 'Montserrat, sans-serif' }}>No news posts yet</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
