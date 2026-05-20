import React, {useState} from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UpdateCourse = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Courses");
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

   const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const course_id = queryParams.get("id");

    console.log("course ID:", course_id);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async() => {
    try {

      const response = await fetch(`http://localhost:3000/v1/course/edit_course?course_id=${course_id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if(data.status){
        setOriginalData(formData)
        setIsEditing(false)
        alert(data.message)
      } else{
        alert(data.message || "Update failed")
      }
 
    } catch (error) {
      console.log(error);      
    }
  }

  useEffect(() => {
    const fetchData = async()=>{
      try {

        const response = await fetch(`http://localhost:3000/v1/course/fetch_single_course?course_id=${course_id}`, {
          credentials: 'include',
          method: 'GET'
        })
        let data = await response.json();
        console.log('data', data);
        
        if(data.status){
          let d = data.data
          
          let formattedData = {
            name: d.name,
            price: d.price,
            duration: d.duration
          }
          console.log('formattedData', formattedData);
          
          setFormData(formattedData)
          setOriginalData(formattedData)
        }

      } catch (error) {
        console.log(error);        
      }
    }
    fetchData()
  }, [])

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* left part */}
      <SidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-5 pb-10'>
        <div className='md:flex md:items-center md:justify-start block w-full'>
         {/* <div onClick={() => setOpen(!open)} className="md:hidden px-1 py-1 bg-gray-300 rounded text-black">
            <Menu />
          </div> */}

          <div className="flex items-center w-full md:order-0 order-1 py-2 md:hidden">

                    <div className="flex-1">
                        <div
                        onClick={() => setOpen(!open)}
                        className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black"
                        >
                        <Menu />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <Logo />
                    </div>

                    <div className="flex-1"></div>
                    
          </div>

          <div className="flex-1 text-center md:text-left">
            <Page_name
              name="Course detail"
              tagline="Manage your course information"
            />
          </div>
        </div>
          

          {/* form */}
          <div className='w-full md:w-3/5 my-5 relative'>
          <form action="">
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Course name</label><br />
              <input type="text" name='name' onChange={handleChange} disabled={!isEditing} value={formData?.name || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Price</label><br />
              <input type="text" name='price' onChange={handleChange} disabled={!isEditing} value={formData?.price || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Duration</label><br />
              <input type="text" name='duration' onChange={handleChange} value={formData?.duration} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            
            {/* <div className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold'>
              <button>Update Profile</button>
            </div> */}
            {!isEditing && (
              <button className='bg-blue-500 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold hover:bg-blue-600' onClick={() => setIsEditing(true)}>
                Update Course
              </button>
            )}

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <button type='button' className='bg-gray-300 border-2 border-gray-400 text-black mt-6 px-8 py-2 absolute right-50 rounded text-sm md:text-base font-semibold hover:bg-blue-500 hover:text-white' onClick={handleCancel}>Cancel</button>
                <button type='button' className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold hover: bg-blue-500' onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </form>
            
          </div>
        </div>

     
    </div>
  )
}

export default UpdateCourse
