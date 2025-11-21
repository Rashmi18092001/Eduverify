const express = require('express');
const router = express.Router();
const { verifyCertificate } = require('../controllers/verifyController');

router.get('/verify_certificate', verifyCertificate);
 
module.exports = router;