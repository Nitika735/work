const express=require("express");
const bcrypt=require("bcryptjs"); // save hashed password in database
const jwt=require("jsonwebtoken"); // after login sucessfully it create the token or (digital id-card) so whenever user visit new page this card (or token) is checked by the server
const mysql=require("mysql2");
const crypto =require("crypto");//creates temporary secret string or (token) expires after a short time
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
app.post("/forgot-password",(req,res)=>{
    const {email}=req.body;
    const token=crypto.randomBytes(32).toString("hex");//32 bytes=64 hexadecimal character(0-9,a-f) 
    const expires=new Date(Date.now()+900000);//set expiry to 15min from now (1min=60,000 so 15 min=15*60*1000)
    const query="update users set reset_token=?,reset_token_expires=? where email=?";
    db.query(query,[token,expires,email],(err,result)=>{
        if(err) return res.status(500).send("DB error");
        if(result.affectedRows===0) return res.status(404).send("User does not found");
        
        res.json({mesaage:"Token generated",token:token});
    });
});

app.post("/reset_password",async(req,res)=>{
    const {token,newPassword}=req.body;  
    const findQuery="select * from users where reset_token=? and reset_token_expires > now()";
    db.query(findQuery,[token],async(err,result)=>{
        if (err || result.length===0) return res.status(400).send("Invalid or expired token");
        const hashedPassword= await bcrypt.hash(newPassword,10);
        const updateQuery="update users set password=?,reset_token=null,reset_token_expires=null where id=?";
        db.query(updateQuery,[hashedPassword,result[0].id],(err)=>{
 
            if (err) return res.status(500).send("Update Failed");
            res.send("Password updated succesfully");
        });
    });         
});    
const port=5000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});