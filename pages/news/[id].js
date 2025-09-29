import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*, users (name, username, profile_image_url)')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!router.isReady || loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }
  
  if (!post) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <Link href="/news">← Back to News</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <Link href="/news" style={{ color: '#667eea', textDecoration: 'none', fontSize: '16px', marginBottom: '30px', display: 'inline-block' }}>
          ← Back to News
        </Link>

        <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' }}>
          {post.title}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#666' }}>
          {post.users?.profile_image_url && (
            <img src={post.users.profile_image_url} alt={post.users.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          )}
          <div>
            <Link href={'/' + post.users?.username} style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>
              {post.users?.name}
            </Link>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {post.featured_image_url && (
          <img src={post.featured_image_url} alt={post.image_alt || post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '15px', marginBottom: '30px' }} />
        )}
        
        <div style={{ marginBottom: '40px', lineHeight: '1.8', fontSize: '18px', color: '#333' }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '20px' }}>{paragraph}</p>
          ))}
        </div>

        {post.external_link && (
          <a href={post.external_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#667eea', color: 'white', padding: '15px 30px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '30px' }}>
            {post.link_button_text || 'Visit Link'} →
          </a>
        )}

        <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '30px', marginTop: '40px' }}>
          <Link href="/news" style={{ background: '#f3f4f6', color: '#667eea', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
            ← Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
