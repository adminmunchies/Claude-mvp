export default function SkeletonLoader({ type = 'card' }) {
  const pulseStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite'
  }

  if (type === 'card') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            marginRight: '15px',
            ...pulseStyle
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{
              height: '20px',
              width: '70%',
              borderRadius: '4px',
              marginBottom: '8px',
              ...pulseStyle
            }}></div>
            <div style={{
              height: '16px',
              width: '40%',
              borderRadius: '4px',
              ...pulseStyle
            }}></div>
          </div>
        </div>
        <div style={{
          height: '16px',
          width: '100%',
          borderRadius: '4px',
          marginBottom: '8px',
          ...pulseStyle
        }}></div>
        <div style={{
          height: '16px',
          width: '80%',
          borderRadius: '4px',
          marginBottom: '15px',
          ...pulseStyle
        }}></div>
        <div style={{
          height: '14px',
          width: '60%',
          borderRadius: '4px',
          ...pulseStyle
        }}></div>
        <style jsx>{`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  if (type === 'artwork') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '250px',
          ...pulseStyle
        }}></div>
        <div style={{ padding: '25px' }}>
          <div style={{
            height: '20px',
            width: '80%',
            borderRadius: '4px',
            marginBottom: '10px',
            ...pulseStyle
          }}></div>
          <div style={{
            height: '16px',
            width: '100%',
            borderRadius: '4px',
            marginBottom: '8px',
            ...pulseStyle
          }}></div>
          <div style={{
            height: '16px',
            width: '60%',
            borderRadius: '4px',
            ...pulseStyle
          }}></div>
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  return null
}
