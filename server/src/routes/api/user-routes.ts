// src/routes/api/user-routes.ts
import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/index.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't send passwords
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Don't send password
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    // Return user without password
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update fields
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ 
        where: { username },
      });
      if (existingUser && existingUser.id !== parseInt(id)) {
        res.status(409).json({ message: 'Username already exists' });
        return;
      }
      user.username = username;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Return user without password
    res.json({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const createTestUser = async (_req: Request, res: Response): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const newUser = await User.create({
      username: 'testuser',
      password: hashedPassword
    });

    res.status(201).json({ 
      message: 'Test user created successfully',
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { router as userRouter };