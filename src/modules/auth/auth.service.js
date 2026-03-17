const User = require("../../models/User");
const bcrypt = require("bcryptjs");// save hashed password in database
const jwt = require("jsonwebtoken");//creates a token or id-card after login so whenever user visit new page the token can be check by the server
const { Op } = require("sequelize");

exports.registerUser = async (data) => {
    const { first_Name, last_Name, email, contact, password, confirm_password } = data;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return { error: "email already registered", status: 400 };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        first_Name,
        last_Name,
        email,
        contact,
        password: hashedPassword,
        confirm_password: hashedPassword
    });
    return { user, status: 201 };
};

exports.loginUser = async ({email,password,confirm_password}) => {
    const user = await User.findOne({ where: { email } });
    if(password!==confirm_password){
        return{error:"password do not match",status:400};
    }
    if (!user) {
        return { error: "invalid email or password", status: 401 };
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return {error:"invalid email or password",status:401};
    }
    
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return { token, user, status: 200 };
}

exports.forgotPassword = async (email) => {

    const otp = Math.floor(1000 + Math.random() * 9000).toString();//4 digit otp from 1000 to 8999
    const expires = new Date(Date.now() + 600000);//set expiry to 10min from now (1min=60,000 so 10 min=10*60*1000)
    const updatedRows = await User.update({
        reset_token: otp,
        reset_token_expires: expires
    },
        { where: { email } }
    );
    return { updatedRows, otp };
};

exports.resetPassword =async (otp,newPassword)=>{
     const user = await User.findOne({
            where: {
                reset_token:otp,
                reset_token_expires: { [Op.gt]: new Date() }
            }
        });
        if (!user) {
            return {error:"Invalid or expired token" , status:400};
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await user.update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expires: null
        });
        return {sucsess:true};
};

exports.getAllUsers= async ()=>{
    const users=await User.findAll({
        attributes:["id","first_Name","last_Name","email","contact"]
    });
    return users;
};

exports.getUserById=async(id)=>{
    const user=await User.findByPk(id,{
        attributes:["id","first_Name","last_Name","email","contact"]
    });
    return user;
}