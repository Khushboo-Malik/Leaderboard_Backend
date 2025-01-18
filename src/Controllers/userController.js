require("dotenv").config()

const User = require("../Models/userModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const axios = require("axios");

//SignUp Function
async function handleUserSignup(req, res) {

    const body = req.body;
    const user = {

        UserId:body.UserId,
        Username: body.Username,
        Password: body.Password,
        
    }
    const result=await User.findOne({"Username":user.Username});
    if(result){
        return res.json("Username already exists");
    };

    const result2=await User.findOne({"UserId":user.UserId});
    if(result2){
        return res.json("UserId already exists");
    };
    if(!user.Password){
        return res.status(400).json("Please enter password");
    }
    if(!user.UserId){
        return res.status(400).json("Please enter ID");
    }
    if(!user.Username){
        return res.status(400).json("Please enter name");
    } 
    
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
            res.status(500).send("Couldn't generate salt");
        } else {

            bcrypt.hash(user.Password, salt, async (hashErr, hash) => {
                if (hashErr) {
                    res.status(500).send("Couldn't hash password");
                } else {

                    user.Password = hash;
                    user.Salt = salt;

                    try {
                        const result = await User.create(user);
                        console.log("finaluser:", result);
                        return res.status(200).json("Signup Successfull!");

                    } catch (dbError) {
                        return res.status(500).json("Database error");
                    }
                }
            });
        }
    })
};


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