import { jwtVerify } from 'jose';

import User from '../models/User.js';

const isAuthorized = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  // empty token
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, no token' });
  }

  try {
    // verify token
    const {
      payload: { id },
    } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // find user
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized error in try catch' });
  }
};

export default isAuthorized;
