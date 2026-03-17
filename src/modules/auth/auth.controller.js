const authService = require("./auth.service");

exports.register = async (req, res) => {
    try {
        const {password, confirm_password } = req.body;
        if (password !== confirm_password) {
         return res.status(400).json({message:"password do not match"});
        }
        const result=await authService.registerUser(req.body);
        if(result.error){
            return res.status(result.status).json(result.error);
        }
        res.status(201).json({
                message: "User Registered Successfully",
                user: {
                    Id: result.user.id,
                    Name: result.user.first_Name,
                    Email: result.user.email
                }
            });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: "error registering user",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, confirm_password }= req.body;
        const result= await authService.loginUser(req.body);
        if(result.error){
            return res.status(result.status).json({message:result.error});
        }
        return res.status(200).json({
            message: "Login Successful",
            token: result.token,
            user: {
                Id: result.user.id,
                Name: result.user.first_Name,
                Email: result.user.email
            }
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const result= await authService.forgotPassword(req.body.email);

        if (result.updatedRows=== 0){
            return res.status(404).json({message:"User not found"});
        }
        return res.json({
            message: "Otp generated and saved successfully",
            OTP:result.otp
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message:"Database Error"});
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;
        const result= await authService.resetPassword(otp,newPassword);
        if(result.error){
            return res.status(result.status).json(result.error);
        }
        return res.status(200).send("Password updated successfully! You can now login.");

    } catch (err) {
        console.error("Reset Error:", err);
        return res.status(500).send("Error resetting password");
    }
};

exports.getAllUsers = async(req,res)=>{
    try{
        const users=await authService.getAllUsers();
        res.status(200).json({
            message:"Users reterived successfully",
            count:users.length,
            data:users
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error fetching users data",
            error:error.message
        });
    }
};
exports.getUserById=async(req,res)=>{
    try{
        const{id}=req.params;
        const user=await authService.getUserById(id);
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        res.status(200).json({
            message:"user reterived successfully",
            data:user
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Server error or error fetching data",
            error:error.message
        });
    }
};