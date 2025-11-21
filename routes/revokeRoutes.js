const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { revokeStudent } = require('../controllers/revokeController');
 

router.put('/revoke_student', auth, revokeStudent);


 
module.exports = router;