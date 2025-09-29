import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function NewsManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    external_link: '',
    link_button_text: 'Visit Link',
    featured_image: null,
    image_alt: '',
    status: 'draft',
    is_featured_on_homepage: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkUser();
    fetchPosts();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  }

  async function fetchPosts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, featured_image: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        external_link: formData.external_link || null,
        link_button_text: formData.link_button_text || 'Visit Link',
        featured_image_url: formData.featured_image,
        image_alt: formData.image_alt || formData.title,
        status: formData.status,
        is_featured_on_homepage: formData.is_featured_on_homepage,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('news_posts')
        .insert([postData]);

      if (error) throw error;

      alert('Post created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        external_link: '',
        link_button_text: 'Visit Link',
        featured_image: null,
        image_alt: '',
        status: 'draft',
        is_featured_on_homepage: false
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(postId, currentStatus) {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('news_posts')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  }

  async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }

  if (loading && !user) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/dashboard" style={{
          color: '#667eea',
          textDecoration: 'none',
          fontSize: '16px',
          marginBottom: '30px',
          display: 'inline-block'
        }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>
          News & Updates
        </h1>

        <div style={{ background: 'white', borderRadius: '15px', padding: '40px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Your Posts ({posts.length})
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '12px 24px',
                  background: '#2c3e50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                + Create Post
              </button>
            )}
          </div>

          {showForm && (
            <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '10px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Create New Post</h3>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '8px 16px',
                    background: '#2c3e50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Post title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Content *
                  </label>
                  <textarea
                    placeholder="Share your thoughts, updates, or announcements..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    External Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.external_link}
                    onChange={(e) => setFormData({...formData, external_link: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '14px' }}>
                    Add an external link (e.g., exhibition website, article, gallery)
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Link Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="Visit Exhibition"
                    value={formData.link_button_text}
                    onChange={(e) => setFormData({...formData, link_button_text: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Featured Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px'
                    }}
                  />
                  {uploading && <p style={{ color: '#667eea', marginTop: '10px' }}>Uploading...</p>}
                  {formData.featured_image && (
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      style={{ marginTop: '15px', maxWidth: '300px', borderRadius: '8px' }}
                    />
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Image Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    placeholder="Describe the image for screen readers"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({...formData, image_alt: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '14px' }}>
                    e.g., "Colorful abstract painting with blue and red tones"
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      padding: '12px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>

                  <label style={{ marginLeft: '20px', display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured_on_homepage}
                      onChange={(e) => setFormData({...formData, is_featured_on_homepage: e.target.checked})}
                      style={{ marginRight: '8px' }}
                    />
                    Feature on homepage
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploading}
                  style={{
                    padding: '14px 28px',
                    background: loading ? '#999' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Post'}
                </button>
              </form>
            </div>
          )}

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>No posts yet</p>
              <p>Create your first post to share updates with your audience!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{
                border: '2px solid #eee',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '20px'
              }}>
                {post.featured_image_url && (
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: post.status === 'published' ? '#28a745' : '#ffc107',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {post.status}
                    </span>
                    {post.is_featured_on_homepage && (
                      <span style={{
                        padding: '4px 12px',
                        background: '#667eea',
                        color: 'white',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </p>
                  <p style={{ color: '#666', marginBottom: '15px' }}>
                    {post.content.substring(0, 150)}...
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => togglePublish(post.id, post.status)}
                      style={{
                        padding: '8px 16px',
                        background: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
