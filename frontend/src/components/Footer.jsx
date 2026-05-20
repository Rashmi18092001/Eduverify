import React from 'react'
import LogoImg from "../images/Logo.png";

const Footer = () => {
  return (
    <div className='w-full text-white bg-blue-900 flex justify-between items-center px-2 md:px-19 md:py-3 py-1 flex-col md:flex-row gap-2'>
        <div className='flex items-center gap-2'>
          
          <img src={LogoImg} alt="" className='md:w-[7%] md:h-[7%] w-[10%] h-[10%]'/>
            <h2 className='text-xl font-semibold'>EduVerify <span className='text-xs'>- Secure certificates, trusted futures</span></h2>
        </div>
        <div>
            <h3 className='text-xs font-semibold'>©2026 Eduverify. All Rights Reserved</h3>
        </div>
    </div>
  )
}

export default Footer
