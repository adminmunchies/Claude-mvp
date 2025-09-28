import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TestSingleArtist() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    testQuery();
  }, []);

  async function testQuery() {
    console.log('Testing query for noelfoertig...');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'noelfoertig')
      .eq('account_status', 'active');
    
    console.log('Query result:', { data, error });
    setResult({ data, error });
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Single Artist Query</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
