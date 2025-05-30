// src/models/ticket.ts
import { DataTypes, Model } from 'sequelize';
export class Ticket extends Model {
}
export function TicketFactory(sequelize) {
    Ticket.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Todo',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        assignedUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    }, {
        tableName: 'tickets',
        sequelize,
    });
    return Ticket;
}
