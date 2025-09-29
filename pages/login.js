import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before logging in. Check your inbox for the confirmation link.');
        }
        throw signInError;
      }

      if (data.session) {
        // Explicitly redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to log in');
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
          color: '#333',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Login
        </h1>

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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '30px',
          color: '#666'
        }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{
            color: '#667eea',
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
