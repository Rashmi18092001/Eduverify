const express = require('express');
const router = express.Router();
// const auth = require('../services/jwt');
const { editInstitution, InstStats, fetchInstitutionCertificates, issueCertificate, fetchInstitution, revokeCertificate} = require('../controllers/institutionController');
const auth = require('../middlewares/authMiddleware')
const {upload} = require('../middlewares/multerMiddleware')

router.put('/edit_institution', upload.fields([{name: 'profile_picture', maxCount: 1}]), auth, editInstitution);
router.get('/stats', auth, InstStats);
router.get('/fetch_institution_certificates', auth, fetchInstitutionCertificates);
router.post('/issue_certificate', auth, issueCertificate);
router.get('/fetch_institution', auth, fetchInstitution);
router.put('/revoke_certificate', auth, revokeCertificate);





 
module.exports = router;