import React, {useState, useEffect} from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'

const Issue_certificate_form = () => {
  let navigate = useNavigate()

    let curr_date = new Date()
    let defaultIssueDate = curr_date.toISOString().split("T")[0]
    let defaultEndDate = new Date()
    defaultEndDate.setDate(defaultEndDate.getDate() - 1)
    defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1)
    defaultEndDate = defaultEndDate.toISOString().split("T")[0];

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Issue Certificate");
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [studentName, setStudentName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [issueDate, setIssueDate] = useState(defaultIssueDate);
    const [expiryDate, setExpiryDate] = useState(defaultEndDate);
    const [loading, setLoading] = useState(false);

    const handleSearch = async(value) => {
      setStudentName(value);
      setShowDropdown(true);

      try {
              
              const response = await fetch(
                  `http://localhost:3000/v1/student/fetch_student_by_search?search=${value}`,
                  {
                      credentials: 'include',
                      method: 'GET'
                  }
              );

              const data = await response.json();

              const newData = data.data.splice(0,5)

              if(data.status){
                  setFilteredStudents(newData)
              } else{
                  setFilteredStudents([])
              }
          } catch (error) {
              console.log(error);            
          }
    };

    const handleSelectStudent = (student) => {
      setStudentName(student.name);
      setSelectedStudentId(student._id); 
      setShowDropdown(false);
    };

    const handleCourseSearch = async(value) => {
      setCourseName(value);
      setShowCourseDropdown(true);

       try {
              
              const response = await fetch(
                  `http://localhost:3000/v1/course/fetch_all_course?name=${value}`,
                  {
                      credentials: 'include',
                      method: 'GET'
                  }
              );

              const data = await response.json();

              const newData = data.data.splice(0,5) 
              console.log('newData', newData);

              
              if(data.status){
                  setCourses(newData)
                  setFilteredCourses(newData)
              } else{
                setFilteredCourses([])
              }
          } catch (error) {
              console.log(error);            
          }
    };

    const handleSelectCourse = (course) => {
      setCourseName(course.name);
      setSelectedCourseId(course._id); 
      setShowCourseDropdown(false);
    };
    
    const handleSubmit = async(e)=>{
      e.preventDefault();
      setLoading(true)
      
      try {
              
        const response = await fetch(`http://localhost:3000/v1/institution/issue_certificate`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify({
            student_id: selectedStudentId,
            course_id: selectedCourseId,
            issue_date: issueDate,
            expiry_date: expiryDate
          })
        })

        const data = await response.json();
        if(data.status){
          console.log('dataaaa', data);
          
          let certId = data.id
          // alert(data.message)
          
          // navigate('/certificates')

          // hit generate pdf api
          console.log('first api complete');
          
          let second_response = await fetch(`http://localhost:3000/v1/pdf/generate_pdf`, {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
              certificate_id: certId
            })
          })

          let second_data = await second_response.json();
          if(second_data.status){
            console.log('second api complete');
            
            navigate('/certificates')
          } else{
            setLoading(false)
            alert(second_data.message)
          }

        } else{
          setLoading(false)
          alert(data.message)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);        
      }
    }

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* left part */}
      <SidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        

      {/* right part */}
      <div className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-10 pb-5 mx-auto'>
      <div className="flex items-center w-full md:order-0 py-2 md:hidden">

        <div className="flex-1">
          <div onClick={() => setOpen(!open)} className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black" >
            <Menu />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <Logo />
        </div>

        <div className="flex-1"></div>
                    
      </div>
        <Page_name name="Issue Certificate" tagline="Fill in the details to issue a new certificate"/>


        {/* form */}
        <div className='mt-10 w-full mx-auto md:mx-0 '>
          <form onSubmit={handleSubmit} action="">
            <div>
                <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                    <div className='w-full mb-3 md:mb-0 relative'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Select Student</label><br />
                        <input value={studentName} onChange={(e) => handleSearch(e.target.value)} className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Select Student'/>

                        {showDropdown && filteredStudents.length > 0 && (
                          <div
                            style={{
                              border: "1px solid #ccc",
                              position: "absolute",
                              width: "100%",
                              background: "#fff",
                              maxHeight: "200px",
                              overflowY: "auto",
                            }}
                          >
                            {filteredStudents.map((student) => (
                              <div
                                key={student._id}
                                onClick={() => handleSelectStudent(student)}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {student.name}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    
                </div>
                <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                    <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Certificate name</label><br />
                        <input className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter certificate name'/>
                    </div>
                    <div className='md:w-1/2 w-full mb-3 md:mb-0 relative'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Course/ Program</label><br />
                        <input value={courseName} onChange={(e) => handleCourseSearch(e.target.value)} className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter course/ program'/>

                        {showCourseDropdown && filteredCourses.length > 0 && (
                          <div
                            style={{
                              border: "1px solid #ccc",
                              position: "absolute",
                              width: "100%",
                              background: "#fff",
                              maxHeight: "200px",
                              overflowY: "auto",
                            }}
                          >
                            {filteredCourses.map((course) => (
                              <div
                                key={course._id}
                                onClick={() => handleSelectCourse(course)}
                                style={{
                                  padding: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {course.name}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                </div>
                <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                            <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                            <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Issue date</label><br />
                            <input value={issueDate}  onChange={(e) => setIssueDate(e.target.value)} className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Select Date'/>
                            </div>
                            <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                            <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Expiry date</label><br />
                            <input  value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Select Date'/>
                            </div>
                </div>
            </div>
            
            <div className='flex justify-end gap-2 md:gap-10 mt-10 md:mt-20'>
              <div className='w-50 '>
                <button className='border-2 px-1 py-1.5 md:px-3 md:py-2 w-full border-gray-500 rounded md:text-base text-sm hover:bg-blue-500 hover:text-white hover:border-blue-500'>Cancel</button>
              </div>
              <div className='w-50'>
                <button type='submit' disabled={loading} className='border-2 px-3 py-2 w-full bg-blue-500 text-white rounded md:text-base text-sm flex items-center justify-center gap-2 disabled:opacity-70 h-11 hover:bg-blue-600'> 
                  {loading ? (
                      <>
                          <Loader2 size={18} className='animate-spin' />
                          Generating...
                      </>
                  ) : (
                      'Generate Certificate'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Issue_certificate_form
