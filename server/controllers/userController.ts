import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import User from '../models/User';

const generateToken = (id: string, isAdmin: boolean): string => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export const registerUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      displayName,
      isAdmin: false // Default to regular user
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
      token: generateToken(user._id as string, user.isAdmin)
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        token: generateToken(user._id as string, user.isAdmin)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        avatarUrl: user.avatarUrl
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};