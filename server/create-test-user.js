// create-test-user.js
// Run this script to create a test user in your database

import bcrypt from 'bcrypt';
import { User } from './src/models/user.js';
import { sequelize } from './src/config/connection.js';

const createTestUser = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { username: 'testuser' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Password hashed successfully');

    // Create the user
    const newUser = await User.create({
      username: 'testuser',
      password: hashedPassword
    });

    console.log('Test user created successfully:');
    console.log('Username: testuser');
    console.log('Password: password123');
    console.log('User ID:', newUser.id);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await sequelize.close();
  }
};

createTestUser();