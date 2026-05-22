import React, {useState, useEffect} from 'react'
import { FolderLock } from 'lucide-react';
import { QrCode } from 'lucide-react';
import { Users } from 'lucide-react';
import { Handshake } from 'lucide-react';
import certificate from '../images/certificate.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Landing_page = () => {

  let navigate = useNavigate();
  
  useEffect(()=>{
          console.log('profile fetching');
  
          const fetchProfile = async() => {
              try {
                  // const response = await fetch('http://localhost:3000/v1/auth/profile', {
                  const response = await fetch('https://eduverify.onrender.com/v1/auth/profile', {
                      method: 'GET',
                      credentials: 'include'
                  })
  
                  let data = await response.json()
                  console.log('data', data);
                  
                  if(data.status){
                      if(data.role == 'student'){
                          navigate('/student/dashboard')
                      } else if(data.role == 'institution'){
                          navigate('/dashboard')
                      }
                  } 
              } catch (error) {
                  console.log(error);
                  
              }
          }
          fetchProfile()
          
      }, [])
  return (
    <div>
      <div className='bg-[#edf1f9] w-full px-4 md:px-30 py-15 flex justify-between items-center md:flex-row flex-col gap-10 h-[89vh]'>
        {/* text */}
        <div className='w-full md:w-135 text-center md:text-left mb-10 px-10 md:px-0'>
            <h3 className='text-2xl md:text-4xl font-semibold'>Verify. Trust. Achieve.</h3>
            <h1 className='text-2xl md:text-4xl font-semibold leading-15'>Welcome to <span className='font-bold'>Eduverify</span></h1>
            <p className='text-sm md:text-base text-gray-700'>A secure platform to generate, manage and verify educational  certificates with QR code and password protected passwords.</p>

            <div className='mt-5'>
              <Link to='/login' className='text-sm md:text-base px-4 py-2 rounded bg-blue-500 border-blue-500 text-white hover:bg-blue-600'>Get Started</Link>
              <Link to='/verify' className='text-sm md:text-base border-2 border-gray-300 px-4 py-2 rounded text-blue-500 font-semibold ml-5 hover:bg-blue-500 hover:text-white hover:border-blue-500'>Verify Certificate</Link>
            </div>
        </div>

        {/* img */}
        <div className='md:w-1/2 md:h-80 w-full h-full'>
          <img className='w-full h-full ' src={certificate} alt="" />
        </div>
      </div>

      {/* cards wrapper*/}
      <div className='relative h-full flex md:justify-between justify-center items-center gap-20  px-20 md:px-30 py-10 md:mb-0 mb-10 mt-5 md:mt-0 flex-wrap md:flex-nowrap '>
        {/* card */}
        <div className='md:w-50 md:h-30 w-full h-full rounded-xl p-2 flex justify-center items-center flex-col md:block shadow-xl/20'>
          <div className='h-10 text-center'> <FolderLock size={36} color="#58a0e4" strokeWidth={1.75} /></div>
          <h2 className='md:text-[1rem] text-[0.8rem] font-medium text-gray-800'>Secure Certificates</h2>
          <p className='md:text-[0.8rem] text-[0.7rem] font-medium text-gray-600'>Password protected PDF certificates</p>
        </div>
        <div className='md:w-50 md:h-30 w-full h-full rounded-xl p-2 flex justify-center items-center flex-col md:block shadow-xl/20'>
          <div className='w-10 h-10 text-center'> <QrCode size={36} color="#58a0e4" strokeWidth={1.75} /></div>
          <h2 className='md:text-[1rem] text-[0.8rem] font-medium text-gray-800'>Instant Verification</h2>
          <p className='md:text-[0.8rem] text-[0.7rem] font-medium text-gray-600'>Verify authencticity using qr code</p>
        </div>
        <div className='md:w-50 md:h-30 w-full h-full rounded-xl p-2 flex justify-center items-center flex-col md:block shadow-xl/20'>
          <div className='w-10 h-10 text-center'> <Users  size={36} color="#58a0e4" strokeWidth={1.75} /></div>
          <h2 className='md:text-[1rem] text-[0.8rem] font-medium text-gray-800'>Easy Management</h2>
          <p className='md:text-[0.8rem] text-[0.7rem] font-medium text-gray-600'>Manage students and certificates easily</p>
        </div>
        <div className='md:w-50 md:h-30 w-full h-full rounded-xl p-2 flex justify-center items-center flex-col md:block shadow-xl/20'>
          <div className='w-10 h-10 rounded-full text-center'> <Handshake size={36} color="#58a0e4" strokeWidth={1.75} /></div>
          <h2 className='md:text-[1rem] text-[0.8rem] font-medium text-gray-800'>Trusted and flexible</h2>
          <p className='md:text-[0.8rem] text-[0.7rem] font-medium text-gray-600'>Secure, fast and reliable system</p>
        </div>
      </div>
    </div>
    
  )
}

export default Landing_page
