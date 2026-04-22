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
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({
            message: "User not found"
            });
        }

        const match = await user.comparePassword(req.body.password);

        if (!match) {
            return res.status(401).json({
            message: "Wrong password"
            });
        }

        req.session.userId = user._id;

        return res.status(201).json({
            success: true,
            message: "User login successfull",
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: true,
            message: "Login Failed",
        });
    }
};

exports.logout = function(req, res) {
    try {
        req.session.destroy();

        return res.status(201).json({
            success: true,
            message: "User logout successfull",
        });

    } catch (err) {
        return res.status(500).json({
            success: true,
            message: "logout Failed",
        });
    }
    
    
};