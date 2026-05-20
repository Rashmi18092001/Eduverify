import React, {useEffect, useState} from 'react'
import SidebarTab from '../components/SidebarTab';
import { Menu } from 'lucide-react';
import Page_name from '../components/Page_name';
import Logo from '../components/Logo';

const InstProfile = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
     
  useEffect(()=> {
    const fetchDetails = async() => {
      try {

        const response = await fetch('http://localhost:3000/v1/institution/fetch_institution', {
          credentials: 'include',
          method: 'GET'
        })
        let data = await response.json();
        console.log('data', data);
        
        if(data.status){
          let d = data.data
          console.log('d', d);
          
          let formattedData = {
            institutionName: d.name,
            email: d.email,
            phone: d.phone,
            institution_logo: d.inst_data.logoUrl,
            institutionCode: d.inst_data.institutionCode
          }
          console.log('formattedData', formattedData);
          
          setFormData(formattedData)
          setOriginalData(formattedData)
        }

      } catch (error) {
        console.log(error);
        
      }
    }
    fetchDetails()
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        logoFile: URL.createObjectURL(file), // preview
        institution_logo: file // actual file for backend upload
      });
    }
  };

  const handleSave = async() => {
    try {
      {console.log('formData of update', formData);
      }

      const response = await fetch('http://localhost:3000/v1/institution/edit_institution', {
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

  return (
    <div className='flex h-screen overflow-y-auto'>
      {/* left part */}
      <SidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        <div  className='w-full md:w-4/5 min-h-screen overflow-y-auto px-10 md:pr-10 py-10'>
        <div className='md:flex md:items-center md:justify-start w-full block'>
         
          <div className="flex items-center w-full md:order-0 order-1 py-2 md:hidden">

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
                Institution Logo
              </label>

            <div className='mt-3 flex items-center gap-4'>

              {/* Logo Preview */}
              <img
                src={
                  formData?.institution_logo || "" 
                }
                alt="Institution Logo"
                className='w-24 h-24 object-cover rounded-full border-2 border-gray-300'
              />

              {/* Change Button */}
              {isEditing && (
                <div>
                  <label
                    htmlFor="logoUpload"
                    className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-600'
                  >
                    Change Logo
                  </label>

                  <input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    name="institution_logo"
                    onChange={handleLogoChange}
                    className='hidden'
                  />
                </div>
              )}
            </div>
          </div>
            <div className='mb-2 md:mb-5'>
              <label htmlFor="" className='text-base md:text-[1.1rem] font-semibold text-gray-600'>Institution name</label><br />
              <input type="text" name='institutionName' onChange={handleChange} disabled={!isEditing} value={formData?.institutionName} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2 md:mb-5'>
              <label htmlFor="" className='text-base md:text-[1.1rem] font-semibold text-gray-600'>Institution Code</label><br />
              <input type="text" name='code' disabled value={formData?.institutionCode} className='w-full border-2 bg-gray-100 cursor-not-allowed border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            {/* <div className='mb-2 md:mb-5'>
              <label htmlFor="" className='text-base md:text-[1.1rem] font-semibold text-gray-600'>Institution Logo</label><br />
              <input type="file" name='logo' onChange={handleChange} disabled={!isEditing} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div> */}

            <div className='mb-2 md:mb-5'>
              <label htmlFor="" className='text-base md:text-[1.1rem] font-semibold text-gray-600'>Email</label><br />
              <input type="text" name='email' onChange={handleChange} disabled={!isEditing} value={formData?.email} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>

            <div className='mb-2 md:mb-5'>
              <label htmlFor="" className='text-base md:text-[1.1rem] font-semibold text-gray-600'>Phone</label><br />
              <input type="text" name='phone' onChange={handleChange} disabled={!isEditing} value={formData?.phone} className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            
            {/* <div className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold'>
              <button>Update Profile</button>
            </div> */}

            {!isEditing && (
              // <button className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold' onClick={() => setIsEditing(true)}>
              //   Update Profile
              // </button>
              <div className="flex justify-end mt-10 pb-10">
                <button
                  className='bg-blue-500 text-white px-8 py-2 rounded text-sm md:text-base font-semibold hover:bg-blue-600 active:scale-95'
                  onClick={() => setIsEditing(true)}
                >
                  Update Profile
                </button>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-4 mt-6">
                <div className="flex gap-4 mt-6">
                  <div className="flex justify-end gap-4 mt-10 pb-10">
                  <button
                    type='button'
                    className=' border-2 border-gray-400 text-black px-8 py-2 rounded text-sm md:text-base font-semibold active:scale-95 hover:bg-blue-500 hover:text-white hover:border-blue-500'
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                  <button
                    type='button'
                    className='bg-blue-500 text-white px-8 py-2 rounded text-sm md:text-base font-semibold active:scale-95 hover:bg-blue-600'
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
                {/* <button type='button' className='bg-gray-300 border-2 border-gray-400 text-black mt-6 px-8 py-2 absolute right-50 rounded text-sm md:text-base font-semibold' onClick={handleCancel}>Cancel</button>
                <button type='button' className='bg-blue-600 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold' onClick={handleSave}>Save Changes</button> */}
              </div>
              </div>
            )}
          </form>
            
          </div>
        </div>

     
    </div>
  )
}

export default InstProfile
