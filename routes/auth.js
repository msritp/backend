const express = require("express");
const users = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const secret = 'prakash';
const authenticate = require("../middleware/validation");


router.post("/signup", async (req, res) => {
    const { name, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await users.create({
        name,
        password: hash,
    });
    const data = {
        user: {
            id: user.id,
            name: user.name
        }
    };
    const authToken = jwt.sign(data, secret);
    return res.status(200).json({ token: authToken });
});

router.post("/signin", async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await users.findOne({ name });
        if (!user) {
            return res.status(400).json({ error: "No username available" })
        }
        const userPassword = await bcrypt.compare(password, user.password);
        if (userPassword) {
            const data = {
                user: {
                    id: user.id,
                    name: user.name,
                }
            };
            const authToken = jwt.sign(data, secret);
            return res.status(200).json({ token: authToken });
        }
        else {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(400).json(error);

    }
});

router.get("/dashboard", authenticate, (req, res) => {
    try {
        return res.status(200).json({ WlcMessage: `Welcome ${req.user.name}`, id: req.user.id, message: req.user.message });
    } catch (error) {
        return res.status(400).json(error);
    }
})

module.exports = router;