
import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie=(res,userId)=>{
    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Helps prevent CSRF attacks
        maxAge: 7*24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
    return token;
};


  /*const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // only true in production
    sameSite: isProduction ? "Strict" : "Lax", // Lax is safer for localhost testing
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};*/
