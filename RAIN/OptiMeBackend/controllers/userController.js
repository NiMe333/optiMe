const User = require('../models/userModel');

// REGISTER
exports.register = async function(req, res) {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            sex: req.body.sex,
            education: req.body.education,
            employment: req.body.employment
        });

        await user.save();

       return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: err.message
        });
    }
};

exports.login = async function(req, res) {
    
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/questions');
};