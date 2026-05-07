const User = require('../models/userModel');

// REGISTER
exports.register = async function(req, res) {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth
        });

        await user.save();

       return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email
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
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
            message: "User with this email not found"
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
                email: user.email
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