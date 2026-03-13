const {Sequelize}=require("sequelize");
require("dotenv").config();

const db=new Sequelize(
     process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:"mysql",
        logging:false
    }
   
);
db.authenticate()
.then (()=>{
console.log("connected succesfully");
})
.catch(err =>{
    console.log("error"+err);
});
 
module.exports=db;