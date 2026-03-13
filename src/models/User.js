const {DataTypes}=require("sequelize");
const sequelize=require("../config/db");
const User=sequelize.define("User",{
    name:{type:DataTypes.STRING,
        allowNull:false
    },
    email:{type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{type:DataTypes.STRING,
        allowNull:false
    },
    reset_token:{type:DataTypes.STRING},
    reset_token_expires:{type:DataTypes.DATE}
},
{
tableName:"users",
 timestamps: false
});
module.exports=User;