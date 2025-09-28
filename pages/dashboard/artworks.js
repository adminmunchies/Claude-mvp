import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';

export default function ArtworksManagement() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year_created: new Date().getFullYear(),
    medium: '',
    dimensions: '',
    alt_text: '',
    image_url: '',
    sort_order: 0,
    is_featured: false
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
    await loadArtworks(user.id);
  }

  async function loadArtworks(userId) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error loading artworks:', error);
      alert('Error loading artworks: ' + error.message);
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
      const fileName = `${user.id}-artwork-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
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

  async function saveArtwork() {
    try {
      if (!formData.title || !formData.image_url) {
        alert('Please provide at least a title and image.');
        return;
      }

      const { error } = await supabase
        .from('artworks')
        .insert({
          user_id: user.id,
          ...formData,
          year_created: parseInt(formData.year_created),
          sort_order: parseInt(formData.sort_order)
        });

      if (error) throw error;

      alert('Artwork saved successfully!');
      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        year_created: new Date().getFullYear(),
        medium: '',
        dimensions: '',
        alt_text: '',
        image_url: '',
        sort_order: 0,
        is_featured: false
      });
      
      await loadArtworks(user.id);
    } catch (error) {
      alert('Error saving artwork: ' + error.message);
    }
  }

  async function deleteArtwork(artworkId) {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId);

      if (error) throw error;

      alert('Artwork deleted successfully!');
      await loadArtworks(user.id);
    } catch (error) {
      alert('Error deleting artwork: ' + error.message);
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
            My Artworks
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
            <h2>Your Artworks ({artworks.length})</h2>
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
              {showAddForm ? 'Cancel' : '+ Add Artwork'}
            </button>
          </div>

          {showAddForm && (
            <div style={{
              background: '#f9f9f9',
              padding: '30px',
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
              <h3>Add New Artwork</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
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
                      borderRadius: '5px'
                    }}
                    placeholder="Artwork title"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Year Created
                  </label>
                  <input
                    type="number"
                    name="year_created"
                    value={formData.year_created}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Medium
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                    placeholder="Oil on canvas, Digital, etc."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                    placeholder="50x70 cm"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    height: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your artwork..."
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Alt Text (for accessibility)
                </label>
                <input
                  type="text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                  placeholder="Describe the image for screen readers"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Artwork Image *
                </label>
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    style={{ 
                      width: '200px', 
                      height: '200px', 
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

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                />
                <label>Feature this artwork (will appear first)</label>
              </div>

              <button
                onClick={saveArtwork}
                disabled={uploading || !formData.title || !formData.image_url}
                style={{
                  background: (!formData.title || !formData.image_url) ? '#ccc' : '#8a2be2',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  cursor: (!formData.title || !formData.image_url) ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {uploading ? 'Uploading...' : 'Save Artwork'}
              </button>
            </div>
          )}

          {artworks.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {artworks.map(artwork => (
                <div key={artwork.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'white'
                }}>
                  <img 
                    src={artwork.image_url} 
                    alt={artwork.alt_text || artwork.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <h4 style={{ margin: '0', fontSize: '16px' }}>{artwork.title}</h4>
                      {artwork.is_featured && (
                        <span style={{ 
                          background: '#8a2be2', 
                          color: 'white', 
                          padding: '2px 8px', 
                          borderRadius: '10px',
                          fontSize: '12px'
                        }}>
                          Featured
                        </span>
                      )}
                    </div>
                    
                    {artwork.year_created && (
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                        {artwork.year_created}
                      </p>
                    )}
                    
                    {artwork.medium && (
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                        {artwork.medium}
                      </p>
                    )}
                    
                    {artwork.dimensions && (
                      <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                        {artwork.dimensions}
                      </p>
                    )}
                    
                    {artwork.description && (
                      <p style={{ 
                        margin: '0 0 15px 0', 
                        fontSize: '14px', 
                        color: '#555',
                        lineHeight: '1.4'
                      }}>
                        {artwork.description.substring(0, 100)}...
                      </p>
                    )}
                    
                    <button
                      onClick={() => deleteArtwork(artwork.id)}
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
              <h3>No artworks yet</h3>
              <p>Add your first artwork to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
