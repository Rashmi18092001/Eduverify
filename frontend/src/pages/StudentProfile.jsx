import React, {useState} from 'react'
import StudentSidebarTab from '../components/Student_sidebar';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useEffect } from 'react';
import UserImage from '../images/dummy_user.png'

const StudentProfile = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async() => {
    try {

      // const response = await fetch('http://localhost:3000/v1/student/edit_student', {
      const response = await fetch('https://eduverify.onrender.com/v1/student/edit_student', {
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
        alert("Profile updated successfully")
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

        // const response = await fetch('http://localhost:3000/v1/student/fetch_student', {
        const response = await fetch('https://eduverify.onrender.com/v1/student/fetch_student', {
          credentials: 'include',
          method: 'GET'
        })
        let data = await response.json();
        console.log('data', data);
        
        if(data.status){
          let d = data.data
          
          let formattedData = {
            name: d.name,
            email: d.user_details.email,
            phone: d.phone_no,
            address: d.address,
            profile_picture: d.profile_picture
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

  const handleProfileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        profile_picture_file: URL.createObjectURL(file), // preview
        profile_picture: file // actual file for backend upload
      });
    }
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* left part */}
      <StudentSidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-5 pb-10 '>
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
              name="Profile"
              tagline="Manage your account information"
            />
          </div>
        </div>
          

          {/* form */}
          <div className='w-full md:w-3/5 my-5 relative'>
          <form action="">
            <div className='mb-2 md:mb-5 '>
              <label className='text-base md:text-[1.1rem] font-semibold text-gray-600'>
                Profile Picture
              </label>

            <div className='mt-3 flex items-center gap-4'>

              {/* profile Preview */}
              <img
                src={
                  formData?.profile_picture || UserImage
                }
                alt="Profile picture"
                className='w-24 h-24 object-cover rounded-full border-2 border-gray-300'
              />

              {/* Change Button */}
              {isEditing && (
                <div>
                  <label
                    htmlFor="profileUpload"
                    className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600'
                  >
                    Change Profile Photo
                  </label>

                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    name="profile_picture"
                    onChange={handleProfileChange}
                    className='hidden'
                  />
                </div>
              )}
            </div>
          </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Full name</label><br />
              <input type="text" name='name' onChange={handleChange} disabled={!isEditing} value={formData?.name || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Email Address</label><br />
              <input type="text" name='email' onChange={handleChange} disabled={!isEditing} value={formData?.email || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Batch</label><br />
              <input type="text" name='batch' onChange={handleChange} disabled value='2023' className='w-full border-2 bg-gray-100 cursor-not-allowed border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Phone Number</label><br />
              <input type="text" name='phone' onChange={handleChange} disabled={!isEditing} value={formData?.phone || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Address</label><br />
              <input type="text" name='address' onChange={handleChange} disabled={!isEditing} value={formData?.address || ""} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Institution</label><br />
              <input type="text" name='institution' onChange={handleChange} value='Springfield Institution' disabled className='w-full border-2 bg-gray-100 cursor-not-allowed border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>

            {/* <div className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold'>
              <button>Update Profile</button>
            </div> */}
            {!isEditing && (
              <div className='flex justify-end mt-5 '>
                <button className='bg-blue-500 hover:bg-blue-600 text-white mt-6 px-8 py-2 rounded text-sm md:text-base font-semibold' onClick={() => setIsEditing(true)}>
                  Update Profile
                </button>
              </div>
              
            )}

            {isEditing && (
              <div className="flex gap-4 mt-5 justify-end">
                <button type='button' className=' border-2 border-gray-400 text-black mt-6 px-8 py-2  rounded text-sm md:text-base font-semibold hover:bg-blue-500 hover:border-blue-600 hover:text-white' onClick={handleCancel}>Cancel</button>
                <button type='button' className='bg-blue-500 hover:bg-blue-600 text-white mt-6 px-8 py-2 rounded text-sm md:text-base font-semibold' onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </form>
            
          </div>
        </div>

     
    </div>
  )
}

export default StudentProfile
