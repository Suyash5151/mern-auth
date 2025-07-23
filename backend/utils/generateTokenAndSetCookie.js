import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie=(res,userId)=>{
    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // only true in production
        sameSite: isProduction ? "Strict" : "Lax", // Lax for localhost, Strict for production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
};
