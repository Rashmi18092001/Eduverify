import React, {useState} from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';


const AddCourse = () => {
    let navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Courses");
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        duration: ''
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleCancel = () => {
        navigate('/courses')
    }

    const handleSubmit = async(e) => {
        try {
            e.preventDefault();

            const response = await fetch("http://localhost:3000/v1/course/add_course", {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    price: formData.price,
                    duration: formData.duration
                })
            })
            let data = await response.json()
            console.log('data', data);
            
            if(data.status){
                setFormData({
                    name: '',
                    price: '',
                    duration: ''
                })
                alert(data.message)

                

                // navigate("")
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
        <Page_name name="Add Course" tagline="Add course details"/>


        {/* form */}
        <div className='mt-10 w-full mx-auto md:mx-0 '>
          <form onSubmit={handleSubmit} action="">
            <div>
                <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                    <div className='w-full mb-3 md:mb-0'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Course Name</label><br />
                        <input onChange={handleChange} value={formData.name} name='name' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter Course name'/>
                    </div>
                </div>
                <div className='flex gap-1 md:gap-10 md:mb-7 flex-col md:flex-row'>
                    <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Price</label><br />
                        <input onChange={handleChange} value={formData.price}  name='price' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter price'/>
                    </div>
                    <div className='md:w-1/2 w-full mb-3 md:mb-0'>
                        <label className='text-base md:text-[1.1rem] text-gray-700 font-semibold' htmlFor="">Duration</label><br />
                        <input onChange={handleChange} value={formData.duration}  name='duration' className='border-2 w-full p-2 mt-1 border-gray-400 rounded' type="text" placeholder='Enter duration'/>
                    </div>
                </div>
            </div>
            
            <div className='flex justify-end gap-2 md:gap-10 mt-10 md:mt-20'>
              <div className='w-50 '>
                <button type='button' onClick={handleCancel} className='border-2 px-1 py-1.5 md:px-3 md:py-2 w-full border-gray-500 rounded md:text-base text-sm active:scale-95 hover:bg-blue-500 hover:text-white hover:border-blue-500'>Cancel</button>
              </div>
              <div className='w-50'>
                <button type= "submit" className='border-2 px-1 py-1.5 md:px-3 md:py-2 w-full bg-blue-500 text-white rounded md:text-base text-sm active:scale-95 hover:bg-blue-600'>Add course</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCourse
