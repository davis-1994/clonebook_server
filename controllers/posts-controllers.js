import Post from '../models/Post.js';

// create post
export const createPost = async (req, res) => {
  const { title, body } = req.body;

  // empty fields
  if (!title) {
    return res.status(400).json({ error: { title: 'Title is required' } });
  }
  if (!body) {
    return res.status(400).json({ error: { body: 'Body is required' } });
  }

  try {
    const newPost = await Post.create({ title, body, user: req.user._id });
    res.status(201).json({ post: newPost, user: newPost.user });
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

// get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name');
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Error getting posts' });
  }
};
