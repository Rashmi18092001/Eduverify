const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { generate_pdf} = require('../controllers/generate_pdf');
 

router.post('/generate_pdf', generate_pdf);

 
module.exports = router;