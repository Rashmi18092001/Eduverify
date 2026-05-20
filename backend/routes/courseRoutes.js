const express = require('express');
const router = express.Router();
const auth = require('../services/jwt');
const { addCourse, fetchAllCourse, fetchSingleCourse, editCourse, deleteCourse} = require('../controllers/courseController');
 

router.post('/add_course', auth, addCourse);
router.get('/fetch_all_course', auth, fetchAllCourse);
router.get('/fetch_single_course', auth, fetchSingleCourse);
router.put('/edit_course', auth, editCourse);
router.delete('/delete_course', auth, deleteCourse);


 
module.exports = router;