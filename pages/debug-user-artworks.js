import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugUserArtworks() {
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: usersData } = await supabase.from('users').select('id, name, username');
    const { data: artworksData } = await supabase.from('artworks').select('*, users(name, username)');
    
    setUsers(usersData || []);
    setArtworks(artworksData || []);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug: Users and their Artworks</h1>
      
      <h2>Users:</h2>
      {users.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      ))}
      
      <h2>Artworks:</h2>
      {artworks.map(artwork => (
        <div key={artwork.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <p><strong>Title:</strong> {artwork.title}</p>
          <p><strong>Belongs to:</strong> {artwork.users?.name} (@{artwork.users?.username})</p>
          <p><strong>User ID:</strong> {artwork.user_id}</p>
        </div>
      ))}
    </div>
  );
}
