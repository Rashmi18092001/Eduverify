import React, {useState} from 'react'
import StudentSidebarTab from '../components/Student_sidebar';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

const Password_change = () => {
  let navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Change Password");
  const [formData, setFormData] = useState({
    curr_pass: '',
    new_pass: '',
    confirm_pass: ''
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(formData.new_pass !== formData.confirm_pass){
      alert("Passwords do not match")
    }

    // let response = await fetch('http://localhost:3000/v1/student/change_password', {
    let response = await fetch('https://eduverify.onrender.com/v1/student/change_password', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({
        current_pass: formData.curr_pass,
        new_pass : formData.new_pass
      })
    })

    let data = await response.json();
    console.log('data', data);
    
    if(data.status){
      alert(data.message)
      navigate('/student/password')

      setFormData({
        curr_pass: '',
        new_pass: '',
        confirm_pass: ''
      })
    } else{
      alert(data.message)
    }
  } 
       

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* left part */}
      <StudentSidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-5 pb-10'>
        <div className='md:flex md:items-center md:justify-start block w-full'>
         {/* <div
            onClick={() => setOpen(!open)}
            className="md:hidden px-1 py-1 bg-gray-300 rounded text-black"
          >
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
              name="Change Password"
              tagline=""
            />
          </div>
        </div>
          

          {/* form */}
          <div className='w-full md:w-3/5 my-5 relative'>
          <form action="" onSubmit={handleSubmit}>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Current Password</label><br />
              <input type="password" onChange={handleChange} value={formData.curr_pass} name='curr_pass' className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>New Password</label><br />
              <input type="password" onChange={handleChange} value={formData.new_pass} name='new_pass' className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='mb-2'>
              <label htmlFor="" className='font-semibold text-gray-600'>Confirm Password</label><br />
              <input type="password" onChange={handleChange} value={formData.confirm_pass} name='confirm_pass' className='w-full border-2 border-gray-400 px-2 py-2 mt-2 rounded text-gray-700' />
            </div>
            <div className='bg-blue-500 text-white mt-6 px-8 py-2 absolute right-0 rounded text-sm md:text-base font-semibold hover:bg-blue-600'>
              <button type='submit'>Submit</button>
            </div>
          </form>
            
          </div>
        </div>

     
    </div>
  )
}

export default Password_change
