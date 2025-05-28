// src/models/user.ts
import { DataTypes, Model } from 'sequelize';
export class User extends Model {
}
export function UserFactory(sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        sequelize,
    });
    return User;
}
