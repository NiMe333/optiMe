const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, controller.me);

router.post("/register", controller.register);
router.post("/startingForm", authMiddleware, controller.saveForm); //middleware works best in routes just before controller is called

router.post("/login", controller.login);
router.get("/logout", controller.logout);

module.exports = router;
