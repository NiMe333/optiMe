const express = require('express');
const router = express.Router();
const controller = require('../controllers/tokenController');

router.post('/refresh', controller.refresh);

module.exports = router;
