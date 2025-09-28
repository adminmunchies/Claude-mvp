import { useState } from 'react'
import Link from 'next/link'
import ImageUpload from '../../components/ImageUpload'

export default function Artworks() {
  const [artworks, setArtworks] = useState([
    { 
      id: 1, 
      title: 'Sample Artwork 1', 
      description: 'This is a sample artwork', 
      image: 'https://picsum.photos/400/300?random=1',
      price: '500',
      available: true
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    available: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      setArtworks(artworks.map(artwork => 
        artwork.id === editingId 
          ? { ...artwork, ...newArtwork }
          : artwork
      ))
      setEditingId(null)
    } else {
      const artwork = {
        id: Date.now(),
        ...newArtwork
      }
      setArtworks([artwork, ...artworks])
    }
    
    setNewArtwork({ title: '', description: '', image: '', price: '', available: true })
    setShowForm(false)
  }

  const handleEdit = (artwork) => {
    setNewArtwork(artwork)
    setEditingId(artwork.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setArtworks(artworks.filter(art => art.id !== id))
  }

  const resetForm = () => {
    setNewArtwork({ title: '', description: '', image: '', price: '', available: true })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/dashboard" style={{ color: '#9333ea', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ margin: 0, color: '#9333ea' }}>Manage Artworks</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#9333ea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Artwork'}
        </button>
      </div>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3>{editingId ? 'Edit Artwork' : 'Add New Artwork'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Artwork Title"
                  value={newArtwork.title}
                  onChange={(e) => setNewArtwork({...newArtwork, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  placeholder="Description"
                  value={newArtwork.description}
                  onChange={(e) => setNewArtwork({...newArtwork, description: e.target.value})}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <ImageUpload 
                currentImage={newArtwork.image}
                onImageSelect={(image) => setNewArtwork({...newArtwork, image})}
              />

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="number"
                  placeholder="Price (€)"
                  value={newArtwork.price}
                  onChange={(e) => setNewArtwork({...newArtwork, price: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newArtwork.available}
                    onChange={(e) => setNewArtwork({...newArtwork, available: e.target.checked})}
                    style={{ marginRight: '10px' }}
                  />
                  Available for sale
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#9333ea',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {editingId ? 'Update Artwork' : 'Add Artwork'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {artworks.map(artwork => (
            <div key={artwork.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '250px',
                backgroundColor: '#e5e7eb',
                backgroundImage: artwork.image ? `url(${artwork.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666'
              }}>
                {!artwork.image && 'No Image'}
              </div>
              <div style={{ padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{artwork.title}</h4>
                  <div style={{
                    backgroundColor: artwork.available ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {artwork.available ? 'Available' : 'Sold'}
                  </div>
                </div>
                <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>
                  {artwork.description}
                </p>
                {artwork.price && (
                  <p style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1rem' }}>
                    €{artwork.price}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(artwork)}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(artwork.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
