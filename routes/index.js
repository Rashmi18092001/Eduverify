const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const pdfRoutes = require('./pdfRoutes');
const studentRoutes = require('./studentRoutes');
const verifyRoutes = require('./verifyRoutes');
const institutionRoutes = require('./institutionRoutes');
const adminRoutes = require('./adminRoutes');
const courseRoutes = require('./courseRoutes');



router.use('/auth', authRoutes)
router.use('/pdf', pdfRoutes)
router.use('/student', studentRoutes)
router.use('/verify', verifyRoutes)
router.use('/institution', institutionRoutes)
router.use('/admin', adminRoutes)
router.use('/course', courseRoutes)



 
module.exports = router;