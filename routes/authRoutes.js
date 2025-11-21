const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { register, login, refresh_token} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh_token', refresh_token);


 
module.exports = router;