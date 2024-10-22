const User = require("../models/User")
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/middleware");


router.post('/register', async (req, res) => {
    const { username, email, password } = await req.body;

    try {
        const genSalt = 10;
        const salt = await bcrypt.genSalt(genSalt);

        const user = await User.findOne({ email: email });
        if (user) return res.status(401).send("user already exist, please login");

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        await newUser.save();
        const { password: newPassword, ...rest } = newUser._doc;
        
        return res.status(201).json({ message: "insciprion reussi", user: rest })
    } catch (error) {
        return res.status(500).send("Server error", error);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = await req.body;

    try {

        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).send("user not found");

        const decrypte = await bcrypt.compare(password, user.password);
        if (!decrypte) return res.status(401).send("Email or Password dont match");

        // Générer un token JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

        res.status(200).json({ token: token, username: user.username });
    } catch (error) {
        return res.status(500).json("Server error", error);
    }
});

router.get('/verify', middleware, async (req, res) => {
    return res.status(200).json({ success: true, user: req.user })
})

module.exports = router