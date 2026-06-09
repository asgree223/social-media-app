import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001'

function CreatePost() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const username = localStorage.getItem('username')
  const avatar = username ? username[0].toUpperCase() : '?'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    const response = await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, avatar, content })
    })

    if (response.ok) {
      navigate('/home')
    } else {
      alert('Failed to create post. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="create-box">
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" disabled={!content.trim() || loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
