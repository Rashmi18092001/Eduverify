const express = require('express');
const router = express.Router();
// const auth = require('../services/jwt');
const auth = require('../middlewares/authMiddleware')
const { addStudent, fetchSingleStudent, fetchStudent, editStudent, deleteStudent, revokeStudent, fetchStudentBySearch, fetchCertificates , fetchOwnCertificates, changePassword} = require('../controllers/studentController');
const {upload} = require('../middlewares/multerMiddleware')


router.post('/add_student', auth, addStudent);
router.get('/fetch_single_student', auth, fetchSingleStudent);
router.get('/fetch_student', auth, fetchStudent);
router.put('/revoke_student', auth, revokeStudent);
router.put('/edit_student', upload.fields([{name: 'profile_picture', maxCount: 1}]), auth, editStudent);
router.delete('/delete_student', auth, deleteStudent);
router.get('/fetch_student_by_search', auth, fetchStudentBySearch);
router.get('/fetch_student_certificates', auth, fetchCertificates);
router.get('/fetch_own_certificates', auth, fetchOwnCertificates);
router.get('/change_password', auth, changePassword);





 
module.exports = router;