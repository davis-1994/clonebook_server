import express from 'express';

import { createPost } from '../controllers/posts-controllers.js';

import isAuthorized from '../middleware/authorize-middleware.js';

const postsRouter = express.Router();

postsRouter.post('/create', isAuthorized, createPost);

export default postsRouter;
