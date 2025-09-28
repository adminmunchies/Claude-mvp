import { useState } from 'react'

export default function ImageUpload({ onImageSelect, currentImage }) {
  const [preview, setPreview] = useState(currentImage || '')
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      onImageSelect(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlInput = (e) => {
    const url = e.target.value
    setPreview(url)
    onImageSelect(url)
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
        Image
      </label>
      
      {/* Preview */}
      {preview && (
        <div style={{ 
          marginBottom: '15px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          maxWidth: '300px'
        }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              height: '150px', 
              objectFit: 'cover' 
            }}
          />
        </div>
      )}

      {/* File Upload */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      </div>

      {/* URL Input */}
      <div>
        <input
          type="url"
          placeholder="Or paste image URL"
          value={preview}
          onChange={handleUrlInput}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      </div>
    </div>
  )
}
