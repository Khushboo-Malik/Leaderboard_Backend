require("dotenv").config();
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//SignUp Function
async function handleUserSignup(req, res) {
    try {
        const { UserId, Username, Password } = req.body;

        // Check for missing fields
        if (!UserId || !Username || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if Username already exists
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists" });
        }

        // Check if UserId already exists
        const existingUserId = await User.findOne({ UserId });
        if (existingUserId) {
            return res.status(409).json({ message: "UserId already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Create user
        const newUser = await User.create({
            UserId,
            Username,
            Password: hashedPassword,
            Salt: salt,
        });

        return res.status(201).json({ message: "Signup successful!" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Server error during signup" });
    }
}

//Login Function

async function handleUserLogin(req, res) {
    const { Username, Password } = req.body;

    try {
        const user = await User.findOne({ Username });

        if (!user)
            return res.status(400).json("User does NOT exist");
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (isPasswordValid) {
            return res.status(200).json("Login Successfull");

        } else {
            res.status(401).json("Authentication Failed");
        }
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
};
module.exports = {
    handleUserSignup, handleUserLogin};