import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileNav from '../components/MobileNav'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonLoader from '../components/SkeletonLoader'

export default function ArtistsDirectory() {
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [allArtists, setAllArtists] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [styleFilter, setStyleFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Simulate data loading
  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAllArtists([
        {
          id: 1,
          name: 'Dominique Foertig',
          username: 'koslitsch',
          bio: 'Contemporary artist exploring digital and traditional mediums',
          avatar: 'https://picsum.photos/100/100?random=1',
          artworkCount: 12,
          location: 'Vienna, Austria',
          style: 'Contemporary',
          priceRange: 'mid'
        },
        {
          id: 2,
          name: 'Sample Artist',
          username: 'sampleartist',
          bio: 'Abstract painter with focus on color theory',
          avatar: 'https://picsum.photos/100/100?random=2',
          artworkCount: 8,
          location: 'Berlin, Germany',
          style: 'Abstract',
          priceRange: 'high'
        },
        {
          id: 3,
          name: 'Maria Schmidt',
          username: 'mariaschmidt',
          bio: 'Minimalist sculptor working with natural materials',
          avatar: 'https://picsum.photos/100/100?random=3',
          artworkCount: 15,
          location: 'Munich, Germany',
          style: 'Minimalist',
          priceRange: 'low'
        }
      ])
      setLoading(false)
    }

    loadArtists()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Simulate search delay
  const handleSearch = async (value) => {
    setSearchTerm(value)
    if (value.length > 0) {
      setSearchLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setSearchLoading(false)
    }
  }

  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || artist.location.includes(locationFilter)
    const matchesStyle = !styleFilter || artist.style === styleFilter
    
    return matchesSearch && matchesLocation && matchesStyle
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {isMobile && <MobileNav />}
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: isMobile ? '30px 20px' : '40px', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '40px' }}>
            <h1 style={{ 
              fontSize: isMobile ? '2rem' : '3rem', 
              margin: '0 0 20px 0', 
              color: '#9333ea' 
            }}>
              Artist Directory
            </h1>
            <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#666' }}>
              Discover amazing artists and their work
            </p>
          </div>

          {!loading && (
            <>
              {/* Search with loading indicator */}
              <div style={{ marginBottom: '20px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: searchLoading ? '40px' : '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                {searchLoading && (
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <LoadingSpinner size="small" text="" />
                  </div>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              {isMobile && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '20px'
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              )}

              {/* Filters */}
              {(!isMobile || showFilters) && (
                <div style={{ 
                  display: isMobile ? 'flex' : 'grid',
                  flexDirection: isMobile ? 'column' : 'row',
                  gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">All Locations</option>
                    <option value="Vienna">Vienna</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Munich">Munich</option>
                  </select>

                  <select
                    value={styleFilter}
                    onChange={(e) => setStyleFilter(e.target.value)}
                    style={{
                      padding: '12px',
                      fontSize: '16px',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="">All Styles</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>
              )}

              <p style={{ color: '#666', fontSize: '14px' }}>
                Showing {searchLoading ? '...' : filteredArtists.length} of {allArtists.length} artists
              </p>
            </>
          )}
        </div>
      </div>

      <div style={{ 
        padding: isMobile ? '30px 20px' : '40px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {loading ? (
          // Loading skeletons
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: isMobile ? '20px' : '30px'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonLoader key={i} type="card" />
            ))}
          </div>
        ) : searchLoading && searchTerm ? (
          // Search loading
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <LoadingSpinner size="large" text="Searching artists..." />
          </div>
        ) : (
          // Actual content
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: isMobile ? '20px' : '30px'
          }}>
            {filteredArtists.map(artist => (
              <Link key={artist.id} href={`/${artist.username}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: isMobile ? '20px' : '30px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <div style={{
                      width: isMobile ? '80px' : '60px',
                      height: isMobile ? '80px' : '60px',
                      borderRadius: '50%',
                      backgroundImage: `url(${artist.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginRight: isMobile ? '0' : '15px',
                      marginBottom: isMobile ? '15px' : '0'
                    }}></div>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 5px 0', 
                        color: '#1f2937',
                        fontSize: isMobile ? '1.3rem' : '1.1rem'
                      }}>
                        {artist.name}
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        color: '#9333ea', 
                        fontSize: '0.9rem' 
                      }}>
                        @{artist.username}
                      </p>
                    </div>
                  </div>
                  
                  <p style={{ 
                    color: '#6b7280', 
                    marginBottom: '15px', 
                    lineHeight: '1.5',
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: isMobile ? '0.9rem' : '1rem'
                  }}>
                    {artist.bio}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                    marginBottom: '15px',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}>
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#374151'
                    }}>
                      {artist.style}
                    </span>
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#374151'
                    }}>
                      {artist.location}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.9rem', 
                    color: '#9ca3af',
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left',
                    gap: isMobile ? '5px' : '0'
                  }}>
                    <span>{artist.artworkCount} artworks</span>
                    <span>{artist.priceRange === 'low' ? 'Under €500' : artist.priceRange === 'mid' ? '€500-€2K' : '€2K+'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !searchLoading && filteredArtists.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h3 style={{ color: '#9ca3af' }}>No artists found</h3>
            <p style={{ color: '#9ca3af' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
