const express = require('express');
const router = express.Router();
const { verifyCertificate, fetchQR } = require('../controllers/verifyController');

router.get('/verify_certificate', verifyCertificate);
router.get('/fetch_QR', fetchQR);
 
module.exports = router;