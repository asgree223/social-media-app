import { Link } from 'react-router-dom'

const API = 'http://localhost:3001'

function PostCard({ post, onUpdate, onDelete }) {
  const currentUser = localStorage.getItem('username')
  const isLiked = post.likes.includes(currentUser)

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  async function handleLike() {
    const response = await fetch(`${API}/api/posts/${post.id}/like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser })
    })
    const updatedPost = await response.json()
    onUpdate(updatedPost)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return

    await fetch(`${API}/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser })
    })
    onDelete(post.id)
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-header-left">
          <div className="avatar">{post.avatar}</div>
          <div>
            <Link to={`/profile/${post.username}`} className="post-username">
              {post.username}
            </Link>
            <div className="post-time">{formatDate(post.createdAt)}</div>
          </div>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions">
        <button
          className={`btn-like ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes.length}
        </button>

        {post.username === currentUser && (
          <button className="btn-delete" onClick={handleDelete}>
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default PostCard
