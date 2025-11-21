const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { addAdmin, loginAdmin, editAdmin, fetchAllInstitutions, fetchSingleInstitution, fetchStudentByInstitution} = require('../controllers/adminController');

router.post('/add_admin', addAdmin);
router.post('/admin_login', loginAdmin);
router.put('/edit_admin', auth, editAdmin);
router.get('/fetch_single_institution', auth, fetchSingleInstitution);
router.get('/fetch_all_institutions', auth, fetchAllInstitutions);
router.get('/fetch_student_by_institution', auth, fetchStudentByInstitution);

 
module.exports = router;