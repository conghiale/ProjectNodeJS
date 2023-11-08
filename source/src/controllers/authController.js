const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/model.js").User;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Email or password is incorrect.' });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Email or password is incorrect.'  });
        }
        const token = createToken(user);
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
const createToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.SECRET_Key);
};
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: req.user });
});
module.exports = router;