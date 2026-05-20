import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const Navbar = () => {
  return (
    <div className='md:h-20 w-full flex justify-between items-center px-2 md:px-19 md:flex-row flex-col h-full py-2'>
        <Logo/>
        <div className='text-sm  md:text-[1.2rem] font-medium flex justify-between items-center md:gap-50 md:flex-row flex-col gap-3'>
          <div className='flex gap-10 justify-between'>
            <Link className='border-2 border-gray-300 md:px-4  px-2 py-1 rounded hover:bg-blue-500 hover:text-white hover:border-blue-500' to='/login'>Login</Link>
            <Link className='md:px-4 md:py-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600' to='/register'>Register</Link>
          </div>
        </div>
        
    </div>
  )
}

export default Navbar
