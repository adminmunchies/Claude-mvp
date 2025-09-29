import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');

        if (errorCode) {
          if (errorCode === 'otp_expired') {
            setError('Email confirmation link has expired. Please sign up again or request a new confirmation email.');
            setLoading(false);
            setTimeout(() => router.push('/signup'), 3000);
            return;
          }
          throw new Error(errorDescription || 'Authentication failed');
        }

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) throw sessionError;

          if (data.session) {
            router.push('/dashboard');
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }

      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message);
        setLoading(false);
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router]);

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
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {loading ? (
          <>
            <div style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ color: '#333', marginBottom: '10px' }}>Confirming your email...</h2>
            <p style={{ color: '#666' }}>Please wait while we verify your account.</p>
          </>
        ) : error ? (
          <>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>Verification Failed</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
            <p style={{ color: '#999', fontSize: '14px' }}>Redirecting...</p>
          </>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
