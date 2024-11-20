import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

import User from '../models/User.js';

// login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // empty fields
  if (!email) {
    return res.status(400).json({ error: { email: 'Email is required' } });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: { password: 'Password is required' } });
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: { email: 'User not found' } });
  }

  // check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: { password: 'Invalid password' } });
  }

  // create token
  const token = await new SignJWT({ id: user._id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // send response
  res.status(200).json({ token });
};

// register
export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // empty fields
  if (!name) {
    return res.status(400).json({ error: { name: 'Name is required' } });
  }
  if (!email) {
    return res.status(400).json({ error: { email: 'Email is required' } });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: { password: 'Password is required' } });
  }

  // confirm password
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: { confirmPassword: 'Passwords do not match' } });
  }

  // email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: { email: 'Invalid email format' } });
  }
  // password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: { password: 'Password must be at least 6 characters' } });
  }
  // password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: {
        password:
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      },
    });
  }

  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: { email: 'User already exists' } });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // create token
  const token = await new SignJWT({ id: user._id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // send response
  res.status(201).json({ token });
};

// me
export const getMe = async (req, res) => {
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

    // send response
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized error in try catch' });
  }
};
