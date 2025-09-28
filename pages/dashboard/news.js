import { useState } from 'react'
import Link from 'next/link'

export default function News() {
  const [articles, setArticles] = useState([
    { 
      id: 1, 
      title: 'My Latest Exhibition', 
      content: 'Excited to announce my upcoming exhibition at Gallery XYZ...', 
      image_url: 'https://picsum.photos/400/200?random=1',
      link_url: 'https://gallery-xyz.com/exhibition',
      published: true,
      created_at: '2024-01-15'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    published: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      setArticles(articles.map(article => 
        article.id === editingId 
          ? { ...article, ...newArticle }
          : article
      ))
      setEditingId(null)
    } else {
      const article = {
        id: Date.now(),
        ...newArticle,
        created_at: new Date().toISOString().split('T')[0]
      }
      setArticles([article, ...articles])
    }
    
    setNewArticle({ title: '', content: '', image_url: '', link_url: '', published: false })
    setShowForm(false)
  }

  const handleEdit = (article) => {
    setNewArticle({
      title: article.title,
      content: article.content,
      image_url: article.image_url || '',
      link_url: article.link_url || '',
      published: article.published
    })
    setEditingId(article.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setArticles(articles.filter(article => article.id !== id))
  }

  const togglePublished = (id) => {
    setArticles(articles.map(article =>
      article.id === id 
        ? { ...article, published: !article.published }
        : article
    ))
  }

  const resetForm = () => {
    setNewArticle({ title: '', content: '', image_url: '', link_url: '', published: false })
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
        <h1 style={{ margin: 0, color: '#9333ea' }}>Manage News</h1>
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
          {showForm ? 'Cancel' : 'Add News'}
        </button>
      </div>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3>{editingId ? 'Edit News Article' : 'Add New Article'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Article Title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
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
                  placeholder="Article Content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  required
                  rows="6"
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
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={newArticle.image_url}
                  onChange={(e) => setNewArticle({...newArticle, image_url: e.target.value})}
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
                <input
                  type="url"
                  placeholder="Link URL (optional)"
                  value={newArticle.link_url}
                  onChange={(e) => setNewArticle({...newArticle, link_url: e.target.value})}
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
                    checked={newArticle.published}
                    onChange={(e) => setNewArticle({...newArticle, published: e.target.checked})}
                    style={{ marginRight: '10px' }}
                  />
                  Publish immediately
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
                  {editingId ? 'Update Article' : 'Add Article'}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {articles.map(article => (
            <div key={article.id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: article.published ? '4px solid #10b981' : '4px solid #f59e0b',
              overflow: 'hidden'
            }}>
              {article.image_url && (
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${article.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
              )}
              
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{article.title}</h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      {article.created_at} • {article.published ? 'Published' : 'Draft'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => togglePublished(article.id)}
                      style={{
                        backgroundColor: article.published ? '#f59e0b' : '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {article.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p style={{ color: '#333', lineHeight: '1.6', marginBottom: '15px' }}>
                  {article.content}
                </p>
                
                {article.link_url && (
                  <a 
                    href={article.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#9333ea',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  >
                    Read More
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
