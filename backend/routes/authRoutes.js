const express = require('express');
const router = express.Router();
// const auth = require('../services/jwt');
const auth = require('../middlewares/authMiddleware')
const { register, login, logout, refresh_token, profile} = require('../controllers/authController');
const {upload} = require('../middlewares/multerMiddleware')

router.post('/register', upload.fields([{name: 'institution_logo', maxCount: 1}]), register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/refresh_token', refresh_token);
router.get('/profile', profile);




 
module.exports = router;