import { useState, useEffect } from 'react'
import PostCard from '../components/PostCard'

const API = 'http://localhost:3001'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load posts. Is the backend running?')
        setLoading(false)
      })
  }, [])

  function handleUpdate(updatedPost) {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  function handleDelete(postId) {
    setPosts(posts.filter(p => p.id !== postId))
  }

  if (loading) return <div className="loading">Loading posts...</div>
  if (error) return <div className="page"><div className="error">{error}</div></div>

  return (
    <div className="page">
      <h2 className="page-title">Feed</h2>

      {posts.length === 0 ? (
        <div className="empty">No posts yet. Be the first to post!</div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  )
}

export default Home
