const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/posts.json');

function readPosts() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writePosts(posts) {
  fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
}

router.get('/', (req, res) => {
  const posts = readPosts();
  const sorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

router.get('/user/:username', (req, res) => {
  const posts = readPosts();
  const { username } = req.params;
  const userPosts = posts
    .filter(p => p.username === username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userPosts);
});

router.post('/', (req, res) => {
  const posts = readPosts();
  const { username, avatar, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ message: 'username and content are required' });
  }

  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    username,
    avatar,
    content,
    likes: [],
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

router.patch('/:id/like', (req, res) => {
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

  writePosts(posts);
  res.json(post);
});

router.delete('/:id', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);
  const { username } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.username !== username) {
    return res.status(403).json({ message: 'You can only delete your own posts' });
  }

  const updated = posts.filter(p => p.id !== id);
  writePosts(updated);

  res.json({ message: 'Post deleted' });
});

module.exports = router;
