import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name: formData.name,
              username: formData.username,
              email: formData.email,
              account_status: 'active',
              subscription_tier: 'basic'
            }
          ]);

        if (profileError) throw profileError;
      }

      setMessage('Account created! Please check your email to confirm your address.');
      setFormData({ name: '', username: '', email: '', password: '' });

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '50px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <Link href="/" style={{
          color: '#667eea',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '30px',
          display: 'inline-block'
        }}>
          ← Back to Home
        </Link>

        <h1 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#667eea',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Join as Artist
        </h1>

        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />

          <input
            type="text"
            placeholder="username (for your public URL)"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
            required
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />

          <input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />

          <input
            type="password"
            placeholder="Choose a strong password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '15px',
              marginBottom: '30px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? '#9ca3af' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Artist Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '30px',
          color: '#666'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{
            color: '#667eea',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
