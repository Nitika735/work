const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = sequelize.define("User", {
    first_Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_Name'
    },
    last_Name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_Name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirm_password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        set(value) {
            if (value !== this.password) {

                throw new Error("Password do not match....");
            }
            this.setDataValue("confirm_password", value);
        }
    }
},
    {
        tableName: "users",
        timestamps: false
    });
module.exports = User;