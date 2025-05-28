// src/models/index.ts
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';
const sequelize = process.env.DB_URL
    ? new Sequelize(process.env.DB_URL)
    : new Sequelize(process.env.DB_NAME || 'kanban_db', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            decimalNumbers: true,
        },
    });
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);
// Define associations
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
export { sequelize, User, Ticket };
