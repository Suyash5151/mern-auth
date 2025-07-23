import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from "dotenv";
import authRoutes from './routes/route.js';
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const __dirname=path.resolve();
app.use(cookieParser());
app.use(express.json());



app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


// ✅ Import confirmation
console.log("✅ Imported authRoutes");

// Mount your routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});



// Start server
app.listen(PORT, () => {
  connectDB();
  console.log("✅ Server is running on port", PORT);
});
