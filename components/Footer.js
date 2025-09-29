import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#111111',
      color: '#ffffff',
      marginTop: '80px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '12px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              M
            </div>
            <p style={{
              fontSize: '14px',
              color: '#999999',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.6'
            }}>
              Selected contemporary art by independent curators
            </p>
          </div>

          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '16px',
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Explore
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://www.munchiesart.club" style={{ color: '#cccccc', textDecoration: 'none', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>Home</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link href="/news" style={{ color: '#cccccc', textDecoration: 'none', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>News</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '16px',
              fontFamily: 'Montserrat, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Connect
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://www.munchiesart.club/ask-kurt-a-curatorial-global-network-project/" target="_blank" rel="noopener noreferrer" style={{ color: '#cccccc', textDecoration: 'none', fontSize: '14px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600' }}>Ask Kurt</a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://instagram.com/munchies.art" target="_blank" rel="noopener noreferrer" style={{ color: '#cccccc', textDecoration: 'none', fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #333333',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '13px', color: '#666666', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
            <a href="https://www.munchiesart.club" style={{ color: '#666666', textDecoration: 'none' }}>Munchies Art Club by Catapult</a>
          </p>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="https://www.munchiesart.club/terms-of-use-2/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#666666', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}>Terms of Service</a>
            <a href="https://www.munchiesart.club/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#666666', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}>Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
