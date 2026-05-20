import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing_page from './pages/Landing_page'
import Admin_dashboard from './pages/Admin_dashboard'
import Login_page from './pages/Login_page'
import Register_page from './pages/Register'
import InstDashboard from './pages/InstDashboard'
import Students from './pages/Students'
import { Outlet } from "react-router-dom";
import {Routes, Route} from 'react-router-dom'
import StudentList from './pages/StudentList'
import StudentDetailInst from './pages/StudentDetailInst'
import Issued_certificate from './pages/Issued_certificate'
import Issue_certificate_form from './pages/Issue_certificate_form'
import Student_dashboard from './pages/Student_dashboard'
import Student_certificates from './pages/Student_certificates'
import StudentProfile from './pages/StudentProfile'
import Password_change from './pages/Password_change'
import InstProfile from './pages/InstProfile'
import AddCourse from './pages/AddCourse'
import Error404Page from './pages/Error404Page'
import ErrorState from './pages/ErrorState'
import Verify from './pages/Verify'
import CourseList from './pages/CourseList'
import SingleCourse from './pages/SingleCourse'
import VerifyPage from './pages/VerifyPage'

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<Landing_page />} />
        <Route path='/admin' element={<Admin_dashboard />} />
      </Route>

      <Route path='/login' element={<Login_page />} />
      <Route path='/register' element={<Register_page />} />
      <Route path='/dashboard' element={<InstDashboard />} />
      <Route path='/add_student' element={<Students/>} />
      <Route path='/students' element={<StudentList />} />
      <Route path='/student_detail' element={<StudentDetailInst />} />
      <Route path='/certificates' element={<Issued_certificate />} />
      <Route path='/issue_certificate' element={<Issue_certificate_form />} />
      <Route path='/student/dashboard' element={<Student_dashboard />} />
      <Route path='/student/certificates' element={<Student_certificates />} />
      <Route path='/student/profile' element={<StudentProfile />} />
      <Route path='/change_password' element={<Password_change />} />
      <Route path='/profile' element={<InstProfile />} />
      <Route path='/error_404' element={<Error404Page />} />
      <Route path='/error_state' element={<ErrorState />} />
      <Route path='/verify' element={<Verify />} />
      <Route path='/add_course' element={<AddCourse />} />
      <Route path='/courses' element={<CourseList />} />
      <Route path='/course_detail' element={<SingleCourse />} />
      <Route path='/verify_certificate/:certificate_id' element={<VerifyPage />} />
   

    </Routes>
  );
};

export default App
