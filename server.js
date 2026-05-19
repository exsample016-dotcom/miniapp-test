const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const UserSchema = new mongoose.Schema({
    telegram_id: Number,
    username: String,
    balance: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    power: {
        type: Number,
        default: 1
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);

app.post("/login", async (req, res) => {

    const { telegram_id, username } = req.body;

    let user = await User.findOne({ telegram_id });

    if(!user){

        user = await User.create({
            telegram_id,
            username,
            balance: 0,
            level: 1,
            power: 1
        });
    }

    res.json(user);
});

app.post("/mine", async (req, res) => {

    const { telegram_id } = req.body;

    let user = await User.findOne({ telegram_id });

    if(!user){
        return res.status(404).json({
            error: "User not found"
        });
    }

    user.balance += user.power;

    if(user.balance >= user.level * 100){
        user.level += 1;
        user.power += 1;
    }

    user.updatedAt = Date.now();

    await user.save();

    res.json({
        balance: user.balance,
        level: user.level,
        power: user.power
    });
});

app.get("/leaderboard", async (req, res) => {

    const users = await User.find()
    .sort({ balance: -1 })
    .limit(10);

    res.json(users);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT}`);
});
