const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt"); // Import bcrypt
const dotenv = require("dotenv");
require('dotenv').config();

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Update your MongoDB connection string here
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected successfully.");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});


const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: { type: String, unique: true },
  dob: Date,
  gender: String,
  address: String,
  password: String,
  otp: String,
  otpExpiration: Date, // Add expiration date for OTP
});

const User = mongoose.model("User", userSchema);

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Signup API
app.post("/api/user/signup", async (req, res) => {
  const { name, mobile, email, dob, gender, address, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      mobile,
      email,
      dob,
      gender,
      address,
      password: hashedPassword, // Store hashed password
      otp,
      otpExpiration,
    });
    
    await newUser.save();

    // Send OTP via email
    const msg = {
      to: email,
      from: process.env.EMAIL_SENDER, // Use your verified sender email
      subject: "Your OTP Code",
      text: `Your OTP code for signup is ${otp}. It is valid for 5 minutes.`,
    };

    await sgMail.send(msg);
    res.status(200).send({ message: "Signup successful, OTP sent to email." });

  } catch (error) {
    console.error("Error in signup:", error); // Log the error
    return res.status(500).send({ message: "Error processing signup" });
  }
});


// Login API
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  // Compare hashed password with the entered password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  // Store user information in session storage
  res.status(200).send({ message: "Login successful", user });
});

// Forgot Password API
app.post("/api/user/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
  user.otp = otp;
  user.otpExpiration = otpExpiration; // Set expiration time
  await user.save();

  // Send OTP via SendGrid
  const msg = {
    to: email,
    from: process.env.EMAIL_SENDER,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ message: "OTP sent to email." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).send({ message: "Error sending email" });
  }
});

// Reset Password API
// Reset Password API
app.post("/api/user/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({ message: "Invalid email" });
  }

  // Check if OTP matches and if it has expired
  if (user.otp !== otp) {
    return res.status(400).send({ message: "Invalid OTP" });
  }

  const currentTime = Date.now();
  if (user.otpExpiration < currentTime) {
    return res.status(400).send({ message: "OTP has expired" });
  }

  // Hash the new password before saving
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword; // Update with hashed password
  user.otp = null; // Clear OTP after successful reset
  user.otpExpiration = null; // Clear expiration
  await user.save();
  res.status(200).send({ message: "Password reset successful" });
});


// Profile Update API
app.put("/api/user/profile", async (req, res) => {
  const { email, name, mobile, address } = req.body;
  await User.updateOne({ email }, { name, mobile, address });
  res.status(200).send({ message: "Profile updated successfully" });
});

// Verify OTP with expiration validation
app.post("/api/user/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Check if OTP matches
  if (user.otp !== otp) {
    return res.status(400).send({ message: "Invalid OTP" });
  }

  // Check if OTP is expired
  const currentTime = Date.now();
  if (user.otpExpiration < currentTime) {
    return res.status(400).send({ message: "OTP has expired" });
  }

  // OTP is valid, proceed with signup (e.g., finalize account setup)
  user.otp = null; // Clear OTP after successful verification
  user.otpExpiration = null; // Clear expiration
  await user.save();
  res.status(200).send({
    message: "OTP verified successfully, account activated!",
  });
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
