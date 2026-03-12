const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const mysql=require("mysql2");
const db=require("./db.js");
const app=express();
app.use(express.json());
 
app.post("/register",async (req,res) => {
    const {name,email,password}=req.body;
    try{
    const hashedPassword = await bcrypt.hash(password,10);

    const query =" INSERT into users (name,email,password) values (?,?,?)";
    db.query(query,[name,email,hashedPassword],(err,result) =>{
     if (err){
    console.error(err);
    return res.status(500).send("Database error");
}
     res.status(201).send("User register sucessfully");

    });
}
catch (error){
  res.status(500).send("Error registering user");
}
});

app.post("/login",(req,res)=>{
    const {email,password}=req.body;
    const query="select * from users where email=?";
    db.query(query,[email],async(err,result)=>{
        if (err) throw err;
        if(result.length>0){
            const user=result[0];
            const isMatch=await bcrypt.compare(password,user.password);
            if (isMatch) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});
const port=5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});