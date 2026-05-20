import React, {useState} from 'react'
import myImage from '../images/undraw_education_3vwh.svg';
import Logo from '../components/Logo';
import {useNavigate} from 'react-router-dom'

const Login_page = () => {

  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async(e) => {
      e.preventDefault();

      try {

        const response = await fetch('http://localhost:3000/v1/auth/login', {
        // const response = await fetch('https://edu-verify-3rup.onrender.com/v1/auth/login', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if(response.ok){
          console.log('Success', data);
          
          if(data.status == true){
            alert('Logged in successfully')

            setFormData({
              email: '',
              password: ''
            })

            // localStorage.setItem('token', data.token)
            
            if(data.role == "institution"){
              navigate('/dashboard')
            } else if(data.role == "student"){
              navigate("/student/dashboard")
            }
          } else if(data.message == "User do not have permission to login"){
              alert(data.message)

              setFormData({
                email: '',
                password: ''
              })
          } else{
            alert(data.message)
          }
        }

      } catch (error) {
        console.error("Error:", error);
      }
  }

  return (
    <div className="flex justify-between items-center flex-col md:flex-row md:bg-transparent bg-blue-100">
      {/* image */}
      <div className="p-5 md:w-2/5 w-full h-screen bg-blue-100 hidden md:block">
      <Logo />
      {/* <h2 className='text-2xl text-blue-500 font-bold mx-4.5'>Eduverify</h2> */}
      <div  className='mx-4.5 my-5 h-[60%] w-[90%] relative top-[15%]'>
        <img src={myImage} alt="" className='h-full w-full '/>
      </div>
        
        
      </div>
      {/* form */}
      {/* <div className='w-full md:w-3/5 h-screen flex justify-center px-20 flex-col'> */}
      <div className='w-full md:w-3/5 h-screen flex justify-center md:px-0 px-10 py-20 md:pl-10 md:pr-80 flex-col'>
        <div className='mb-2'>
          <h2 className='text-xl md:text-3xl font-bold text-gray-800'>Welcome Back!</h2>
          <p className='text-sm md:text-base font-semibold text-gray-700'>Login to your account</p>
        </div>
        <div className='w-full'>
          <form onSubmit={handleSubmit} action="" className='w-full '>
            <label htmlFor="" className='block font-semibold text-sm md:text-base text-gray-900 my-2'>Email Address</label>
            <input onChange={handleChange} name='email' value={formData.email} className='w-full border-2 border-gray-400 p-2 rounded text-sm tracking-wider bg-white' type="text" placeholder='Enter your email'/><br />
            <label className='block font-semibold text-sm md:text-base my-2 ' htmlFor="">Password</label>
            <input onChange={handleChange} name='password' value={formData.password} type="password" className='w-full border-2 border-gray-400 rounded p-2 text-sm tracking-wider bg-white' placeholder='Enter your password'/>
            <button className='w-full py-2 font-semibold rounded bg-blue-500 text-white mt-5 text-sm md:text-base active:scale-95 hover:bg-blue-600'>Login</button>
          </form>
          <p className='text-center mt-6'>Don't have an account. <a className='text-blue-500 cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold' href='/register'>Register Now</a></p>
        </div>       
      </div>
    </div>
  )
}

export default Login_page
