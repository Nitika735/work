const { error } = require("console");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");// save hashed password in database
const crypto = require("crypto");//creates temporary secret string or (token) expires after a short time
const jwt = require("jsonwebtoken");//creates a token or id-card after login so whenever user visit new page the token can be check by the server
const { Op } = require("sequelize");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,

        });
        res.status(201).send("User Registered Successfully");

    }
    catch (error) {
        console.log(error)
        res.status(500).send("Error registering user");

    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            return res.status(200).json({
                message: "Login Successful",
                token: token
            });

        }
        else {
            res.status(401).send("Invalid user");
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Server Error");
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const token = crypto.randomBytes(32).toString("hex");//create 64 character password using hexadecimal(0-9,a-f)
        const expires = new Date(Date.now() + 600000);//set expiry to 10min from now (1min=60,000 so 10 min=10*60*1000)
        const [updatedRows] = await User.update(
            { reset_token: token, reset_token_expires: expires },
            { where: { email } }
        );

        if (updatedRows === 0)
            return res.status(404).send("User not found");
         return res.json({ 
            message: "Token generated and saved successfully", 
            token: token 
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Database Error");
    }
};
exports.resetPassword =async (req,res)=>{
    try{
        const {token , newPassword}=req.body;
        const user=await User.findOne({
            where:{
                reset_token:token,
                reset_token_expires:{[Op.gt]:new Date()}
            }
        });
        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expires: null
        });

        return res.status(200).send("Password updated successfully! You can now login.");

    } catch (err) {
        console.error("Reset Error:", err);
        return res.status(500).send("Error resetting password");
    }
};

