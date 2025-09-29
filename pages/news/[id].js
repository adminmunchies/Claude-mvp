import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Footer from '../../components/Footer';

export default function NewsPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  async function loadPost() {
    const { data } = await supabase
      .from('news_posts')
      .select('*, users(name, username, profile_image_url)')
      .eq('id', id)
      .single();

    setPost(data);
    setLoading(false);
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>Loading...</div>;
  }

  if (!post) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif' }}>Post not found</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <Link href="/news" style={{ display: 'inline-block', marginBottom: '32px', fontSize: '14px', color: '#666666', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>← Back to News</Link>

        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.2' }}>{post.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
          {post.users?.profile_image_url && (
            <Link href={`/${post.users.username}`}>
              <img src={post.users.profile_image_url} alt={post.users.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }} />
            </Link>
          )}
          <div>
            <Link href={`/${post.users?.username}`} style={{ fontSize: '16px', fontWeight: '700', color: '#000000', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif', display: 'block', marginBottom: '4px' }}>{post.users?.name}</Link>
            <p style={{ fontSize: '14px', color: '#666666', fontFamily: 'Montserrat, sans-serif' }}>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {post.featured_image_url && (
          <img src={post.featured_image_url} alt={post.image_alt || post.title} style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '12px', marginBottom: '40px' }} />
        )}

        <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#333333', fontFamily: 'Montserrat, sans-serif', marginBottom: '40px' }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '24px' }}>{paragraph}</p>
          ))}
        </div>

        {post.external_link && (
          <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '1px solid #e0e0e0' }}>
            <a href={post.external_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '16px 32px', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}>{post.link_button_text || 'Learn More'} →</a>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
