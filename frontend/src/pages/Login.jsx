import { useState } from 'react'

const API = 'http://localhost:3001'

function Login() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }
      localStorage.setItem('username', data.username)
      window.location.href = '/home'
    } else {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        setLoading(false)
        return
      }
      localStorage.setItem('username', data.username)
      window.location.href = '/home'
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-box">
      <h1>Social Media App</h1>
      <p>{mode === 'login' ? 'Login to your account' : 'Create a new account'}</p>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="login-switch">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={switchMode}>
          {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  )
}

export default Login
