import express from 'express';

import { createPost, getAllPosts } from '../controllers/posts-controllers.js';

import isAuthorized from '../middleware/authorize-middleware.js';

const postsRouter = express.Router();

postsRouter.get('/', isAuthorized, getAllPosts);
postsRouter.post('/create', isAuthorized, createPost);

export default postsRouter;
