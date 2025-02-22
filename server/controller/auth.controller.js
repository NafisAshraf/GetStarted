const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
require("dotenv").config();
const nodemailer = require("nodemailer");

// REGISTER //////////////////////////////////////////////
const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, userType } = req.body;

  try {
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "Email already used" });
    }

    // Generate userId and verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      userType,
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<h2>Please click on the given link to verify your email</h2>
            <p>${process.env.CLIENT_URL}verify-user/${verificationToken}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        return res
          .status(500)
          .json({ message: "Error sending verification email" });
      }
      // Respond with success message and token
      return res.status(201).json({
        message: "User registered successfully. Verification email sent.",
        token: verificationToken,
        result: savedUser,
      });
    });
  } catch (error) {
    // Handle registration errors
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// LOGIN //////////////////////////////////////////////
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Authentication Failed" });
    }

    // Check if user is verified
    if (user.verification !== "verified") {
      return res.status(401).json({ message: "User not verified" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password doesn't match
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication Failed" });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and user details
    return res.status(200).json({
      accessToken: jwtToken,
      userId: user._id,
      userType: user.userType,
      userName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    // Handle login errors
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};

/// VERIFY USER //////////////////////////////////////////////

const verifyUser = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $set: { verification: "verified" } }
    );

    console.log(user);
    return res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

/// RESEND VERIFICATION //////////////////////////////////////////////

const resendVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const verifyEmail = await userModel.findOne({ email: email });
    if (!verifyEmail) {
      return res.status(403).json({
        message: "Email not found",
      });
    } else {
      const verificationToken = jwt.sign(
        { email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
        html: `<h2>Please click on this new given link to verify your email</h2>
               <p>${process.env.CLIENT_URL}verify-user/${verificationToken}</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        } else {
          return res.status(200).json({
            message: "Verification link sent to your email",
            token: verificationToken,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Forget Password //////////////////////////////////////////////
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    //Verifying email
    const verifyEmail = await userModel.findOne({ email: email });
    if (!verifyEmail) {
      return res.status(403).json({
        message: "Email not found",
      });
    } else {
      // Create json web token and send reset password link including web token
      let jwtToken = jwt.sign(
        {
          email: verifyEmail.email,
          userId: verifyEmail.userId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // Send reset password link to user email
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset Password",
        html: `<h2>Please click on given link to reset your password</h2>
                <p>${process.env.CLIENT_URL}reset-password/${jwtToken}</p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        } else {
          return res.status(200).json({
            message: "Reset password link sent to your email",
            token: jwtToken,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

const resetpassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;
  console.log(token);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const userBeforeUpdate = await userModel.findOne({ email: decoded.email });
    console.log("User before password update:", userBeforeUpdate);

    // Check if newPassword and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Hash new password
    const hash = await bcrypt.hash(password, 10);
    // Update password
    console.log("New hashed password:", hash);
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: hash } }
    );
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};


module.exports = { register, login, verifyUser, resendVerification, forgetPassword, resetpassword};
