const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { editInstitution, InstStats} = require('../controllers/institutionController');
 

router.put('/edit_institution', auth, editInstitution);
router.get('/stats', auth, InstStats);


 
module.exports = router;