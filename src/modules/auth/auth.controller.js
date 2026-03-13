const User=require("../../models/User");
const bcrypt=require("bcryptjs");// save hashed password in database
const crypto=require("crypto");//creates temporary secret string or (token) expires after a short time
const {Op}=require("sequelize");

exports.register=async (req,res)=>{
    try{
        const{name,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({name,email,password:hashedPassword});
        res.status(201).send("User Registered Successfully");

    }
    catch(error){
        res.status(500).send("Error registering user");

    }
};
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user= await User.findOne({ where:{email}});
        if(user && bcrypt.compare(password,user.paasword)){
            res.status(200).send("Login Successful");

        }
        else{
            res.status(401).send("Invalid user");
        }
    }
    catch (err){

        res.status(500).send("Server Error");
    }
};
exports.forgotPassword=async(req,res)=>{
    try{
        const{email}=req.body;
        const token=crypto.randomBytes(32).toString("hex");//create 64 character password using hexadecimal(0-9,a-f)
        const expires= new Date(Date.now()+600000);//set expiry to 10min from now (1min=60,000 so 10 min=10*60*1000)
        const [updatedRows] = await User.update(
            { reset_token: token, reset_token_expires: expires },
            { where: { email } }
        );

        if (updatedRows === 0) 
            return res.status(404).send("User not found");
        res.json({ message: "Token generated", token });
    } 
    catch (err) {
        res.status(500).send("DB Error");
    }
};
   