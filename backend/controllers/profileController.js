const User = require("../models/User");

// Get Logged-in User Profile
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.user.id,

      req.body,

      {
        new: true,
        runValidators: true
      }

    ).select("-password");

    res.json({

      success: true,

      message: "Profile Updated",

      user

    });

  }

  catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};