import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';

export default function NewsManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image_url: '',
    status: 'draft',
    is_featured_on_homepage: false
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    await loadNews(user.id);
  }

  async function loadNews(userId) {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNewsPosts(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Error loading news: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(event) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-news-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        featured_image_url: data.publicUrl
      }));

      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function saveNews() {
    try {
      if (!formData.title || !formData.content) {
        alert('Please provide at least a title and content.');
        return;
      }

      const newsData = {
        user_id: user.id,
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('news_posts')
        .insert(newsData);

      if (error) throw error;

      alert('News post saved successfully!');
      setShowAddForm(false);
      setFormData({
        title: '',
        content: '',
        featured_image_url: '',
        status: 'draft',
        is_featured_on_homepage: false
      });
      
      await loadNews(user.id);
    } catch (error) {
      alert('Error saving news: ' + error.message);
    }
  }

  async function updateNewsStatus(newsId, newStatus) {
    try {
      const { error } = await supabase
        .from('news_posts')
        .update({ 
          status: newStatus,
          published_at: newStatus === 'published' ? new Date().toISOString() : null
        })
        .eq('id', newsId);

      if (error) throw error;
      await loadNews(user.id);
    } catch (error) {
      alert('Error updating news status: ' + error.message);
    }
  }

  async function deleteNews(newsId) {
    if (!confirm('Are you sure you want to delete this news post?')) return;

    try {
      const { error } = await supabase
        .from('news_posts')
        .delete()
        .eq('id', newsId);

      if (error) throw error;

      alert('News post deleted successfully!');
      await loadNews(user.id);
    } catch (error) {
      alert('Error deleting news: ' + error.message);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8a2be2',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{
            color: '#8a2be2',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0'
          }}>
            News & Updates
          </h1>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h2>Your News Posts ({newsPosts.length})</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                background: '#8a2be2',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {showAddForm ? 'Cancel' : '+ Create News Post'}
            </button>
          </div>

          {showAddForm && (
            <div style={{
              background: '#f9f9f9',
              padding: '30px',
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
              <h3>Create New News Post</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="News post title"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    height: '200px',
                    resize: 'vertical',
                    fontSize: '16px'
                  }}
                  placeholder="Write your news content here..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Featured Image
                </label>
                {formData.featured_image_url && (
                  <img 
                    src={formData.featured_image_url} 
                    alt="Preview" 
                    style={{ 
                      width: '200px', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '10px',
                      marginBottom: '10px',
                      display: 'block'
                    }} 
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
                  <input
                    type="checkbox"
                    name="is_featured_on_homepage"
                    checked={formData.is_featured_on_homepage}
                    onChange={handleInputChange}
                  />
                  <label>Feature on homepage</label>
                </div>
              </div>

              <button
                onClick={saveNews}
                disabled={uploading || !formData.title || !formData.content}
                style={{
                  background: (!formData.title || !formData.content) ? '#ccc' : '#8a2be2',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  cursor: (!formData.title || !formData.content) ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {uploading ? 'Uploading...' : formData.status === 'published' ? 'Publish News' : 'Save as Draft'}
              </button>
            </div>
          )}

          {newsPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {newsPosts.map(post => (
                <div key={post.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '20px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{post.title}</h3>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ 
                          background: post.status === 'published' ? '#10b981' : '#f59e0b',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {post.status}
                        </span>
                        {post.is_featured_on_homepage && (
                          <span style={{ 
                            background: '#8a2be2',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            Featured
                          </span>
                        )}
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {post.featured_image_url && (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        style={{ 
                          width: '80px', 
                          height: '60px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          marginLeft: '20px'
                        }}
                      />
                    )}
                  </div>
                  
                  <p style={{ 
                    margin: '10px 0 20px 0', 
                    color: '#555',
                    lineHeight: '1.5'
                  }}>
                    {post.content.substring(0, 200)}...
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {post.status === 'draft' ? (
                      <button
                        onClick={() => updateNewsStatus(post.id, 'published')}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => updateNewsStatus(post.id, 'draft')}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '15px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Unpublish
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNews(post.id)}
                      style={{
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666'
            }}>
              <h3>No news posts yet</h3>
              <p>Create your first news post to share updates with your audience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
