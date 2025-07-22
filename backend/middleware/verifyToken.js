import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access, please login first" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }
};