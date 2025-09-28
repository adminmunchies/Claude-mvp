import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import FormValidation, { ErrorMessage } from '../components/FormValidation'

export default function Login() {
  const router = useRouter()

  const validationRules = {
    email: {
      required: true,
      email: true,
      label: 'Email'
    },
    password: {
      required: true,
      minLength: 6,
      label: 'Password'
    }
  }

  const handleLogin = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <Link 
        href="/"
        style={{ 
          color: '#9333ea', 
          textDecoration: 'none', 
          fontSize: '14px',
          display: 'inline-block',
          marginBottom: '20px'
        }}
      >
        ← Back to Home
      </Link>
      
      <h1>Login</h1>
      
      <FormValidation validationRules={validationRules} onSubmit={handleLogin}>
        {({ errors, isSubmitting, getFieldProps }) => (
          <div style={{ marginTop: '30px' }}>
            {errors.submit && (
              <div style={{ 
                backgroundColor: '#fee2e2', 
                color: '#dc2626', 
                padding: '10px', 
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                {errors.submit}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <input 
                type="email" 
                placeholder="Email" 
                required
                {...getFieldProps('email')}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: `1px solid ${errors.email ? '#dc2626' : '#ccc'}`,
                  borderRadius: '5px'
                }}
              />
              <ErrorMessage error={errors.email} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="password" 
                placeholder="Password" 
                required
                {...getFieldProps('password')}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  fontSize: '16px',
                  border: `1px solid ${errors.password ? '#dc2626' : '#ccc'}`,
                  borderRadius: '5px'
                }}
              />
              <ErrorMessage error={errors.password} />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                width: '100%', 
                padding: '15px', 
                backgroundColor: isSubmitting ? '#ccc' : '#9333ea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}
      </FormValidation>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{ color: '#9333ea', textDecoration: 'none' }}>
          Sign up
        </Link>
      </p>
    </div>
  )
}
