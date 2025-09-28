import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugUsernames() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase.from('users').select('name, username');
    setUsers(data || []);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug: Usernames in Database</h1>
      {users.map(user => (
        <div key={user.name} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> "{user.username}"</p>
          <p><strong>URL would be:</strong> /{user.username}</p>
        </div>
      ))}
    </div>
  );
}
