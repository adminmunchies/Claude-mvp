import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DebugProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Profile</h1>
      <h2>Auth User:</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h2>Database Profile:</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
