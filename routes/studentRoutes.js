const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { addStudent, fetchSingleStudent, editStudent, deleteStudent, revokeStudent, fetchStudentBySearch, fetchCertificates } = require('../controllers/studentController');
 

router.post('/add_student', auth, addStudent);
router.get('/fetch_single_student', auth, fetchSingleStudent);
router.put('/revoke_student', auth, revokeStudent);
router.put('/edit_student', auth, editStudent);
router.delete('/delete_student', auth, deleteStudent);
router.get('/fetch_student_by_search', auth, fetchStudentBySearch);
router.get('/fetch_student_certificates', auth, fetchCertificates);




 
module.exports = router;