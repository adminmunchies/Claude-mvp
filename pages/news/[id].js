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
      console.log('Loading post with ID:', id);
      
      const { data, error } = await supabase
        .from('news_posts')
        .select(`
          *,
          users (name, username, profile_image_url)
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

      console.log('Post data:', data, 'Error:', error);

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!router.isReady) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading router...</div>;
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading post...</div>;
  }
  
  if (!post) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <p>Post ID: {id}</p>
        <Link href="/news">← Back to News</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
          {post.title}
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <p>By {post.users?.name} - {new Date(post.published_at).toLocaleDateString()}</p>
        </div>
        
        {post.featured_image_url && (
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            style={{ 
              width: '100%', 
              height: '300px', 
              objectFit: 'cover',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          />
        )}
        
        <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '15px' }}>
              {paragraph}
            </p>
          ))}
        </div>
        
        <Link href="/news" style={{
          background: '#8a2be2',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '25px',
          textDecoration: 'none'
        }}>
          ← Back to News
        </Link>
      </div>
    </div>
  );
}
