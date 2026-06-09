const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data', 'posts.json');
const usersPath = path.join(__dirname, 'data', 'users.json');

function readPosts() {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

function savePosts(posts) {
  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
}

function readUsers() {
  const data = fs.readFileSync(usersPath, 'utf-8');
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

app.post('/api/register', (req, res) => {
  const users = readUsers();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailExists = users.find(u => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const usernameExists = users.find(u => u.username === username);
  if (usernameExists) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const newUser = { id: users.length + 1, username, email, password };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ username, email });
});

app.post('/api/login', (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Wrong email or password' });
  }

  res.json({ username: user.username, email: user.email });
});

app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  const sorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post('/api/posts', (req, res) => {
  const posts = readPosts();
  const { username, avatar, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ message: 'username and content are required' });
  }

  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    username,
    avatar: avatar || username[0].toUpperCase(),
    content,
    likes: [],
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  savePosts(posts);

  res.status(201).json(newPost);
});

app.patch('/api/posts/:id/like', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);
  const { username } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.likes.includes(username)) {
    post.likes = post.likes.filter(u => u !== username);
  } else {
    post.likes.push(username);
  }

  savePosts(posts);
  res.json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);
  const { username } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.username !== username) {
    return res.status(403).json({ message: 'You can only delete your own posts' });
  }

  const updatedPosts = posts.filter(p => p.id !== id);
  savePosts(updatedPosts);

  res.json({ message: 'Post deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/posts`);
});
