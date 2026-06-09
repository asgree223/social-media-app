import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'

const API = 'http://localhost:3001'

function Profile() {
  const { username } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then(res => res.json())
      .then(data => {
        const userPosts = data.filter(p => p.username === username)
        setPosts(userPosts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [username])

  function handleUpdate(updatedPost) {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  function handleDelete(postId) {
    setPosts(posts.filter(p => p.id !== postId))
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar">{username[0].toUpperCase()}</div>
        <h2>{username}</h2>
        <p>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
      </div>

      {posts.length === 0 ? (
        <div className="empty">No posts yet.</div>
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

export default Profile
