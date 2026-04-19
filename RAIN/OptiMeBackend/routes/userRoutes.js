const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/register', (req, res, next) => {
    console.log('route hit');
    next();
}, controller.register);



router.post('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;