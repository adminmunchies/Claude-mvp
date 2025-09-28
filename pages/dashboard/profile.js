import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';

export default function ProfileEdit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio_short: '',
    bio_long: '',
    location: '',
    website_url: '',
    instagram_handle: '',
    contact_email: '',
    profile_image_url: '',
    header_banner_url: ''
  });

  // Get current user on page load
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
    
    // Load existing profile data
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        bio_short: profile.bio_short || '',
        bio_long: profile.bio_long || '',
        location: profile.location || '',
        website_url: profile.website_url || '',
        instagram_handle: profile.instagram_handle || '',
        contact_email: profile.contact_email || '',
        profile_image_url: profile.profile_image_url || '',
        header_banner_url: profile.header_banner_url || ''
      });
    }
  }

  // Handle form input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Upload image to Supabase Storage
  async function uploadImage(event, bucket, fieldName) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [fieldName]: data.publicUrl
      }));

      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  // Save profile to database
  async function saveProfile() {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...formData,
          updated_at: new Date()
        });

      if (error) {
        throw error;
      }

      alert('Profile updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            Edit Profile
          </h1>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>Basic Information</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Your full name"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Username (for your public page)
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="your-artist-name"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Vienna, Austria"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="contact@artist.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>About You</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Short Bio (150 characters)
              </label>
              <textarea
                name="bio_short"
                value={formData.bio_short}
                onChange={handleInputChange}
                maxLength="150"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  height: '80px',
                  resize: 'vertical'
                }}
                placeholder="Contemporary artist based in Vienna..."
              />
              <small style={{ color: '#666' }}>
                {formData.bio_short.length}/150 characters
              </small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Detailed Artist Statement
              </label>
              <textarea
                name="bio_long"
                value={formData.bio_long}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  height: '150px',
                  resize: 'vertical'
                }}
                placeholder="Tell your story, artistic journey, inspirations..."
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>Links & Social</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Website
              </label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="https://your-website.com"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram_handle"
                value={formData.instagram_handle}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="your_instagram_handle"
              />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '20px' }}>Profile Images</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Profile Picture
              </label>
              {formData.profile_image_url && (
                <img 
                  src={formData.profile_image_url} 
                  alt="Profile" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '50%',
                    marginBottom: '10px',
                    display: 'block'
                  }} 
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadImage(e, 'avatars', 'profile_image_url')}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Header Banner
              </label>
              {formData.header_banner_url && (
                <img 
                  src={formData.header_banner_url} 
                  alt="Banner" 
                  style={{ 
                    width: '100%', 
                    height: '150px', 
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
                onChange={(e) => uploadImage(e, 'banners', 'header_banner_url')}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={loading || uploading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #8a2be2, #9b59b6)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '20px'
            }}
          >
            {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
