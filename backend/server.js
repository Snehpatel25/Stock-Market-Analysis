import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_in_production";
const MONGO_URI = process.env.MONGO_URI;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET environment variable is not defined. Using fallback secret.");
}

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration to support local and cloud deployments (Vercel, Render, Netlify)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production" ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    optionsSuccessStatus: 200,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serverless-ready MongoDB connection caching
let cachedDbConnection = null;

const connectDB = async () => {
  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    return cachedDbConnection;
  }

  if (!MONGO_URI) {
    console.error("❌ FATAL: MONGO_URI environment variable is not defined.");
    return null;
  }

  try {
    cachedDbConnection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    console.log("✅ Connected to MongoDB");
    return cachedDbConnection;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    cachedDbConnection = null;
    return null;
  }
};

// Connect immediately on startup and ensure connection per request
connectDB();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: (mobile) => /^[0-9]{10}$/.test(mobile),
      message: "Mobile must be 10 digits",
    },
  },
  isAdmin: { type: Boolean, default: false },
  countryCode: { type: String, default: "+91", trim: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("createaccounts", userSchema);

// Root and Health endpoints
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Stock Analysis API is running" });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "OK",
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid token.",
        details: err.message.includes("expired") ? "Token has expired" : "Invalid token.",
      });
    }
    req.user = decoded;
    next();
  });
}

// Signup handler
const signupHandler = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, mobile, isAdmin } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !mobile) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername) {
      return res.status(409).json({
        error: "User already exists.",
        exists: {
          email: !!existingEmail,
          username: !!existingUsername,
        },
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password,
      mobile,
      isAdmin: !!isAdmin,
    });

    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Registration failed.", details: err.message });
  }
};

// Login handler
const loginHandler = async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid username or practical credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    if (userType && ((userType === "admin" && !user.isAdmin) || (userType === "user" && user.isAdmin))) {
      return res.status(403).json({ error: `Account is not a ${userType} account.` });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: "Login successful.",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Authentication failed.", details: err.message });
  }
};

// Session verify handler
const verifyHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ valid: false, error: "User not found." });
    }
    res.json({ valid: true, user });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ valid: false, error: "Verification failed." });
  }
};

// Update profile handler
const updateUserHandler = async (req, res) => {
  try {
    const { firstName, lastName, mobile, countryCode } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { firstName, lastName, mobile, countryCode } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found." });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update user profile.", details: err.message });
  }
};

// Routes registration
app.post("/api/signup", authLimiter, signupHandler);
app.post("/signup", authLimiter, signupHandler);

app.post("/api/login", authLimiter, loginHandler);
app.post("/login", authLimiter, loginHandler);

app.get("/api/auth/verify", authenticateToken, verifyHandler);
app.get("/auth/verify", authenticateToken, verifyHandler);

app.put("/api/auth/user", authenticateToken, updateUserHandler);
app.put("/auth/user", authenticateToken, updateUserHandler);

app.get("/api/protected", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ message: "Protected route accessed successfully.", user });
  } catch (err) {
    console.error("Protected route error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found.", requestedUrl: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Internal server error.",
    details: err.message,
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
    console.log(`📡 Available endpoints:
    - GET  /api/health
    - POST /api/signup
    - POST /api/login
    - GET  /api/auth/verify
    - PUT  /api/auth/user
    - GET  /api/protected`);
  });
}

export default app;


