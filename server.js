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
            balance: 0
        });
    }

    res.json(user);
});

app.post("/mine", async (req, res) => {

    const { telegram_id } = req.body;

    let user = await User.findOne({ telegram_id });

    user.balance += 1;

    await user.save();

    res.json({
        balance: user.balance
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ${PORT}`);
});