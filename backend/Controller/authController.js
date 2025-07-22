import  User  from "../models/userModels.js"
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js"; 
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../Mailtrap/emails.js";
import { sendWelcomeEmail } from "../Mailtrap/emails.js";
import {sendPasswordResetEmail} from "../Mailtrap/emails.js";


export const signup = async (req, res) => {
  console.log("✅ signup controller HIT");

  const { email, password, name } = req.body;
  console.log("BODY:", req.body);

  try {
    if (!email || !password || !name) {
      console.log("❌ Missing field!");
      throw new Error("All fields required");
    }

    console.log("✅ Fields present. Checking DB...");
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      console.log("❌ User already exists");
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    console.log("✅ New user. Hashing password...");
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    console.log("✅ Saving user...");
    await user.save();

    await sendVerificationEmail(user.email, user.verificationToken);


    console.log("✅ Generating token...");
    generateTokenAndSetCookie(res, user._id);

    console.log("✅ Signup success");
    res.status(201).json({
      success: true,
      message: "User authenticated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  console.log("Received verification code:", code);
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    // ✅ ✅ ✅ HERE'S THE MISSING PIECE: set cookie AGAIN!
    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




export const login = async (req,res)=>{

  const{ email,password}=req.body;
  try{
    const user= await User.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"Invalid credentials"});

    }
    const isPasswordValid=await bcryptjs.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(400).json({success:false,message:"Invalid credentials"});
    }
    generateTokenAndSetCookie(res,user._id);
    user.lastLogin=Date.now();
    await user.save();  
    return res.status(200).json({
      success:true,
      message:"User authenticated successfully",
      user:{
        ...user._doc,
        password:undefined
      }
    });
  }
  catch(error){
    res.status(400).json({success:false,message:error.message});
  }


  res.send("login route");
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // ✅ Make a new random token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    // ✅ Save to DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    console.log("RESET TOKEN:", resetToken);

    // ✅ Send the link with the token
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("RESET LINK:", resetLink);

    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ success: true, message: "Reset link sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("RESET REQUEST:", token);

  try {
    // ✅ Find user by token
    const user = await User.findOne({ resetPasswordToken: token });

    console.log("FOUND USER:", user);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    // ✅ Check expiry
    if (user.resetPasswordExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Token expired" });
    }

    // ✅ Hash new password & save
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;

    // ✅ Clear the reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const logout = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message: "Logged out succesfully"});

};


export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};