import React, { useState } from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Students = () => {

  const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Students");
  const [course, setCourse] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    batch: '',
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  // for course
  useEffect(()=>{
    const fetchCourse = async()=>{

      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3000/v1/course/fetch_all_course', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }) 

        const data = await response.json();
        console.log('data', data);
        
        if(data.status){
          console.log('data', data.data);
          
          setCourse(data.data)
        }
      
      } catch (error) {
          console.error(err);
      }
    }

    fetchCourse()
  }, [])

  // for form
  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/v1/student/add_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, 
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          batch: formData.batch
        })
      })

      const data = await response.json();
      console.log('data', data);
      
      if(data.status){
        alert(data.message)

        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          batch: '',
        })

        navigate('/students')
      }
    } catch (error) {
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
      <div className='w-full md:w-4/5 h-screen overflow-y-auto px-5 pb-5 md:py-5 md:px-10 mx-auto'>
         <div className="flex items-center w-full py-2 md:hidden">
          <div className="flex-1">
            <div onClick={() => setOpen(!open)} className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black">
              <Menu />
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Logo />
          </div>

          <div className="flex-1"></div>
                    
        </div>
        <div>
          <Page_name name="Add new Student" tagline="Fill in the details to add a new student"/>
        </div>
       
        {/* form */}
        <div className='mt-10 w-full mx-auto md:mx-0 '>
          <form action="" onSubmit={handleSubmit}>
            <div>
              <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                <div className='w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Full name</label><br />
                  <input onChange={handleChange} name='name' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter full name'/>
                </div>
              </div>

              <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Email address</label><br />
                  <input onChange={handleChange} name='email' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter Email address'/>
                </div>
                <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Password</label><br />
                  <input onChange={handleChange} name='password' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="password" placeholder='Enter Password'/>
                </div>
                <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Batch/ Year</label><br />
                  <input onChange={handleChange} name='batch' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter Batch or year'/>
                </div>
              </div>

              {/* <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                
              </div> */}

              <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Phone Number</label><br />
                  <input onChange={handleChange} name='phone' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter phone number'/>
                </div>
                <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                  <label className='text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Address</label><br />
                  <input onChange={handleChange} name='address' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter address'/>
                </div>
              </div>

            </div>
            
            <div className='flex justify-end gap-10 mt-10 md:mt-20'>
              <div className='w-32 '>
                <button className='border-2 px-1 py-1.5 md:px-3 md:py-2 w-full border-gray-500 rounded md:text-base text-sm hover:bg-blue-500 hover:text-white hover:border-blue-500'>Cancel</button>
              </div>
              <div className='w-32'>
                <button className='border-2 border-blue-500 px-1 py-1.5 md:px-3 md:py-2 w-full bg-blue-500 text-white rounded md:text-base text-sm hover:bg-blue-600 hover:border-blue-600'>Save Student</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Students
