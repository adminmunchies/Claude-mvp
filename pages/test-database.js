import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestDatabase() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('account_status', 'active');
    
    if (data) setArtists(data);
    if (error) console.error('Error:', error);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Database Test</h1>
      <h2>Artists in Database:</h2>
      {artists.map(artist => (
        <div key={artist.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <p><strong>Name:</strong> {artist.name}</p>
          <p><strong>Username:</strong> {artist.username}</p>
          <p><strong>Location:</strong> {artist.location}</p>
          <p><strong>Bio:</strong> {artist.bio_short}</p>
        </div>
      ))}
    </div>
  );
}
