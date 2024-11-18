import express from 'express';

import { login, getMe, register } from '../controllers/auth-controllers.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/me', getMe);

export default authRouter;
