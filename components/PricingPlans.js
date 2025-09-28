import { useState } from 'react'

export default function PricingPlans({ currentPlan = 'none' }) {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 9.90,
      annualPrice: 99, // 2 Monate gratis
      features: [
        'Professional Artist Profile',
        'Unlimited Artworks',
        'News & Updates',
        'Basic Analytics',
        'Email Support'
      ],
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 19.90,
      annualPrice: 199, // 2 Monate gratis
      features: [
        'Everything in Basic',
        'Featured Artist Placement',
        'Advanced Analytics',
        'Custom Domain Option',
        'Priority Support',
        'Early Access to Features'
      ],
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      popular: true
    }
  ]

  const handleSubscribe = async (priceId) => {
    // Stripe Checkout implementation
    console.log('Subscribe to:', priceId)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Choose Your Plan</h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Unlock the full potential of your artist profile</p>
        
        {/* Billing Toggle */}
        <div style={{ 
          display: 'inline-flex', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px', 
          padding: '4px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setIsAnnual(false)}
            style={{
              backgroundColor: !isAnnual ? 'white' : 'transparent',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: !isAnnual ? 'bold' : 'normal'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            style={{
              backgroundColor: isAnnual ? 'white' : 'transparent',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: isAnnual ? 'bold' : 'normal'
            }}
          >
            Annual (Save 17%)
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 30px',
            boxShadow: plan.popular ? '0 8px 25px rgba(147, 51, 234, 0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
            border: plan.popular ? '2px solid #9333ea' : '1px solid #e5e7eb',
            position: 'relative',
            textAlign: 'center'
          }}>
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#9333ea',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                Most Popular
              </div>
            )}

            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
            
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                €{isAnnual ? plan.annualPrice : plan.monthlyPrice}
              </span>
              <span style={{ color: '#666' }}>
                /{isAnnual ? 'year' : 'month'}
              </span>
            </div>

            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{ 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#10b981', marginRight: '10px' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.stripePriceId)}
              disabled={currentPlan === plan.id}
              style={{
                width: '100%',
                backgroundColor: currentPlan === plan.id ? '#6b7280' : (plan.popular ? '#9333ea' : '#374151'),
                color: 'white',
                border: 'none',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: currentPlan === plan.id ? 'not-allowed' : 'pointer'
              }}
            >
              {currentPlan === plan.id ? 'Current Plan' : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
