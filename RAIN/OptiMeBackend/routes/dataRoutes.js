const express = require('express');
const router = express.Router();
const controller = require('../controllers/dataController');
const authMiddleware = require("../middleware/authMiddleware");

router.get('/mentalHealthScore', authMiddleware, controller.mentalHealthData);

module.exports = router;