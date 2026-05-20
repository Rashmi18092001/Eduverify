import React from 'react'
import LogoImg from "../images/Logo.png";

const Logo = () => {
  return (
    <div className='flex gap-2 items-center px-6'>
      <div className='w-10 h-10 md:w-12 md:h-12'>
        <img className='w-full h-full' src={LogoImg} alt="" />
      </div>
      <div>
        <h2 className='text-3xl text-blue-600 font-bold text-center py-6'>EduVerify</h2>
      </div>
    </div>
  )
}

export default Logo
