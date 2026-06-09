import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  function handleLogout() {
    localStorage.removeItem('username')
    window.location.href = '/login'
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">Social Media App</Link>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/create">New Post</Link>
        <Link to={`/profile/${username}`}>Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
