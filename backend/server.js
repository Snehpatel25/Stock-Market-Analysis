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
const JWT_SECRET = process.env.JWT_SECRET;

// Validate essential environment variables
if (!JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET is not defined");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ FATAL: MONGO_URI is not defined");
  process.exit(1);
}

// Security and middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sp-stockanalysis.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Database connection with retry and timeout
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Exit process in production, retry in development
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      setTimeout(connectDB, 5000);
    }
  }
};

// MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  if (process.env.NODE_ENV === "production") {
    connectDB(); // Auto-reconnect in production
  }
});

connectDB();

// User Schema
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

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "OK",
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Signup endpoint
app.post("/api/signup", authLimiter, async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, mobile, isAdmin } = req.body;

    // Validate required fields
    const requiredFields = { firstName, lastName, email, username, password, mobile };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields.",
        missingFields
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ 
        error: "User already exists.",
        conflict: existingUser.email === email ? "email" : "username"
      });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password,
      mobile,
      isAdmin: !!isAdmin,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Prepare user response without password
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
    res.status(500).json({ 
      error: "Registration failed.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// Login endpoint
app.post("/api/login", authLimiter, async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: "Username and password required.",
        missing: !username ? "username" : "password"
      });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    if (userType && ((userType === "admin" && !user.isAdmin) || (userType === "user" && user.isAdmin))) {
      return res.status(403).json({ 
        error: `Account is not a ${userType} account.`,
        isAdmin: user.isAdmin
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Prepare response
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
    res.status(500).json({ 
      error: "Authentication failed.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: "active",
    error: false,
    apiVersion: "1.0",
    documentation: "/api/docs"
  });
});

// Protected route
app.get("/api/protected", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      success: true,
      message: "Protected route accessed successfully.",
      user,
    });

  } catch (err) {
    console.error("Protected route error:", err);
    res.status(500).json({ 
      error: "Server error.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication token required." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid token.",
        details: err.message.includes("expired") ? "Token expired" : "Invalid token",
        solution: err.message.includes("expired") ? "Please login again" : "Provide a valid token"
      });
    }
    req.user = decoded;
    next();
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found.",
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      "GET /api/health",
      "POST /api/signup",
      "POST /api/login",
      "GET /api/protected"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error.",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Server startup
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Available endpoints:`);
  console.log(`- GET  /api/health`);
  console.log(`- POST /api/signup`);
  console.log(`- POST /api/login`);
  console.log(`- GET  /api/protected`);
});

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});