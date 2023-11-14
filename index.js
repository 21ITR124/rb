const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoUrl = "mongodb+srv://yuvan:yuvan2003@cluser0.llfn1xl.mongodb.net/";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
});

const User = mongoose.model("UserInfo", UserSchema);

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(  password, 10);

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User Exists" });
        }
        await User.create({
            fullName,
            email,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
    }
});

app.post("/login", async (req, res) => {
    const { email,   password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ status: "error", error: "User Not Found" });
    }
    if (await bcrypt.compare(  password, user.  password)) {
        // If the email and password match, send a success response
        return res.json({ status: "ok", message: "Login Successfully" });
    }
    res.json({ status: "error", error: "Invalid Password" });
});

app.listen(5000, () => {
    console.log("server started");
});
