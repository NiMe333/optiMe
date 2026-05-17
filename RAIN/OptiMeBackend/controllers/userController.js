const User = require("../models/userModel");
const Auth = require("../services/auth");

// Register
exports.register = async function (req, res) {
  console.log(req.body);

  try {
    const { email, password, gender, dateOfBirth } = req.body;

    // Check required fields
    if (!email || !password || !gender || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check email
    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check valid date
    const parsedDate = new Date(dateOfBirth);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date of birth",
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      gender,
      dateOfBirth: parsedDate,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check email format
    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // DO NOT LEAK WHICH FIELD IS WRONG
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = Auth.createAccessToken(user);
    const refreshToken = Auth.createRefreshToken(user);

    await Auth.storeRefreshToken(user, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
      success: true,
      message: "User login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        education: user.education,
        employment: user.employment,
        mood: user.mood,
        sleepHours: user.sleepHours,
        activity: user.activity,
        socialConnection: user.socialConnection,
        phoneScreenTime: user.phoneScreenTime,
        stress: user.stress,
        formFinished: user.formFinished,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message,
    });
  }
};

exports.logout = async function (req, res) {
  try {

    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {

      await Auth.revokeRefreshToken(refreshToken); //from DB
      
    }

    res.clearCookie("refreshToken"); //from local

    return res.status(201).json({
      success: true,
      message: "User logout successfull",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: "logout Failed",
    });

  }
};

exports.saveForm = async function (req, res) {
  try {
    const user = await User.findOne({ _id: req.user.userId }); //jwt based

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User with your ID not found",
      });
    }

    user.username = req.body.username;
    user.education = req.body.education;
    user.employment = req.body.employment;
    user.mood = req.body.mood;
    user.sleepHours = req.body.sleepHours;
    user.activity = req.body.activity;
    user.socialConnection = req.body.socialConnection;
    user.phoneScreenTime = req.body.phoneScreenTime;
    user.stress = req.body.stress;
    user.formFinished = true;

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User form successfully saved",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        education: user.education,
        employment: user.employment,
        mood: user.mood,
        sleepHours: user.sleepHours,
        activity: user.activity,
        socialConnection: user.socialConnection,
        phoneScreenTime: user.phoneScreenTime,
        stress: user.stress,
        formFinished: user.formFinished,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Form saving failed",
    });
  }
};

exports.me = async function (req, res) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        education: user.education,
        employment: user.employment,
        mood: user.mood,
        sleepHours: user.sleepHours,
        activity: user.activity,
        socialConnection: user.socialConnection,
        phoneScreenTime: user.phoneScreenTime,
        stress: user.stress,
        formFinished: user.formFinished,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};
