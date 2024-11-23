import express from 'express';

import { login, getMe, register } from '../controllers/auth-controllers.js';

import isAuthorized from '../middleware/authorize-middleware.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/me', isAuthorized, getMe);

export default authRouter;
