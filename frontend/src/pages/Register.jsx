import React, {useState} from 'react'
import registerImage from '../images/undraw_building_burz.svg';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

const Register_page = () => {

  let navigate = useNavigate()

  let [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    confirm_password: '',
    institution_name: '',
    institution_code: '',
    // institution_logo: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(formData.password !== formData.confirm_password){
      alert('passwords do not match');
      return;
    }

    try {
      // const response = await fetch('http://localhost:3000/v1/auth/register', {
      const response = await fetch('https://eduverify.onrender.com/v1/auth/register', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          institutionName: formData.institution_name,
          institutionCode: formData.institution_code,
          institution_logo: formData.institution_logo,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone
        })
      })

      const data = await response.json();

      if(response.ok){
        console.log("Success:", data);

        // store token
        localStorage.setItem('token', data.token);
        if(data.status == true){
          alert("Registered successfully");

          setFormData({
            name: '',
            email: '',
            password: '',
            role: '',
            confirm_password: '',
            institution_name: '',
            institution_code: '',
            // institution_logo: '',
            phone: '',
          })

          navigate('/login')
        } else{
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
        <div className="flex justify-between h-full items-stretch flex-col md:flex-row md:bg-transparent bg-blue-100">
          {/* image */}
          <div className="p-5 md:w-2/5 w-full min-h-screen bg-blue-100 hidden md:block">
          {/* <h2 className='text-2xl text-blue-500 font-bold mx-4.5'>Eduverify</h2> */}
          <Logo/>
          <div  className='mx-4.5 my-5 h-[60%] w-[90%] relative top-[15%]'>
            <img src={registerImage} alt="" className='h-full w-full '/>
          </div>
            
            
          </div>
          {/* form */}
          <div className='w-full md:w-3/5 flex justify-center md:px-0 px-10 py-20 md:pl-10 md:pr-80 flex-col'>
            <div className='mb-2'>
              <div className='text-center md:text-left'>
                <h2 className='text-3xl font-bold text-gray-700'>Create Account</h2>
                <p className='text-base font-semibold text-gray-600'>Register as Institution</p>
              </div>
              
            </div>
            <div className='w-full'>
              <form action="" onSubmit={handleSubmit} className='w-full '>
                <label htmlFor="" className='block font-semibold text-base text-gray-900 my-2'>Institution Name</label>
                <input onChange={handleChange} value={formData.institution_name} name='institution_name' className='w-full  border-2 border-gray-400 p-2 rounded text-sm tracking-wider bg-white' type="text" placeholder='Enter Institution name'/><br />

                <label htmlFor="" className='block font-semibold text-base text-gray-900 my-2'>Institution Code</label>
                <input onChange={handleChange} value={formData.institution_code} name='institution_code' className='w-full  border-2 border-gray-400 p-2 rounded text-sm tracking-wider bg-white' type="text" placeholder='Enter Institution code'/><br />

                {/* <label htmlFor="" className='block font-semibold text-base text-gray-900 my-2'>Institution Logo</label>
                <input onChange={handleChange} name='institution_logo' className='w-full  border-2 border-gray-400 p-2 rounded text-sm tracking-wider bg-white' type="file" placeholder=''/><br /> */}

                <label className='block font-semibold text-base my-2' htmlFor="">Role</label>
                <input type="text" name='role' value={formData.role} onChange={handleChange} className='w-full border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Role'/>


                <label className='block font-semibold text-base my-2' htmlFor="">Phone</label>
                <input type="text" name='phone' value={formData.phone} onChange={handleChange} className='w-full border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Phone'/>

                <label className='block font-semibold text-base my-2' htmlFor="">Email Address</label>
                <input type="email" name='email' value={formData.email} onChange={handleChange} className='w-full  border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Enter email'/>

                <label className='block font-semibold text-base my-2' htmlFor="">Password</label>
                <input type="password" name='password' value={formData.password} onChange={handleChange} className='w-full border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Enter password'/>

                <label className='block font-semibold text-base my-2' htmlFor="">Confirm Password</label>
                <input type="password" name='confirm_password' value={formData.confirm_password} onChange={handleChange} className='w-full border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Confirm Password'/>

                <button className='w-full py-2 font-semibold rounded bg-blue-600 text-white mt-5 active:scale-95 hover:bg-blue-600'>Register</button>
              </form>
              <p className='text-center mt-6'>Already have an account. <a className='text-blue-500 cursor-pointer hover:underline hover:text-blue-600 hover:font-semibold' href='/login'>Login Here</a></p>
            </div>       
          </div>
        </div>
  )
}

export default Register_page
