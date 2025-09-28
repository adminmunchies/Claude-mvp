import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugArtworks() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    const { data } = await supabase.from('artworks').select('*');
    setArtworks(data || []);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug: Artworks in Database</h1>
      {artworks.map(artwork => (
        <div key={artwork.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <p><strong>Title:</strong> {artwork.title}</p>
          <p><strong>Image URL:</strong> {artwork.image_url}</p>
          <p><strong>URL funktioniert?</strong></p>
          <img src={artwork.image_url} alt={artwork.title} 
               style={{ width: '200px', height: '200px', objectFit: 'cover' }}
               onError={(e) => {
                 e.target.style.border = '2px solid red';
                 e.target.alt = 'IMAGE FAILED TO LOAD';
               }}
          />
        </div>
      ))}
    </div>
  );
}
