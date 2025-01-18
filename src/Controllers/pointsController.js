require("dotenv").config()

const User = require("../Models/userModel");

async function claimPoints(req, res) {
    try {
        const { Username } = req.body;

        if (!Username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ Username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const randomPoints = Math.floor(Math.random() * 10) + 1;

        user.Points += randomPoints;
        await user.save();

        const allUsers = await User.find().sort({ Points: -1 }); // Sort by Points in descending order

        for (let i = 0; i < allUsers.length; i++) {
            allUsers[i].Rank = i + 1;
            await allUsers[i].save();
        }

        res.status(200).json({
            message: `Points added successfully! ${randomPoints} points allocated.`,
            user: {
                Username: user.Username,
                Points: user.Points,
                Rank: user.Rank,
            },
        });
    } catch (error) {
        console.error("Error in claimPoints:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function showRanks(req, res) {
    try {
        const users = await User.find().sort({ Rank: 1 }).select("Username Rank");

        return res.status(200).json({
            message: "Ranks fetched successfully",
            users: users.map(user => ({
                Username: user.Username,
                Rank: user.Rank,
                Points:user.Points
            })),
        });
    } catch (error) {
        console.error("Error in showRanks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    claimPoints,showRanks
    };
