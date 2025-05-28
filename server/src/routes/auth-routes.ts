// src/routes/auth-routes.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const router = Router();
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Login route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      secretKey,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register route
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    const token = jwt.sign(
      { 
        id: newUser.id, 
        username: newUser.username 
      },
      secretKey,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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

export const authRouter = router;