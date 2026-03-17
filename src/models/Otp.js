const {DataTypes}=require("sequelize");
const sequelize=require ("../config/db");
const Otp=sequelize.define("Otp",{
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    code:{
        type:DataTypes.STRING,
        allowNull:false
    },
    expires_at:{
        type:DataTypes.DATE,
        allowNull:false
    }
},
    {
        tableName:"otps",
        timestamps:true
    });
module.exports=Otp;