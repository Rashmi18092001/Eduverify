import React from 'react'
import errorImg from "../images/404.jpg"
const Error404Page = () => {
  return (
       <div className='flex justify-center items-center px-10 md:px-20 py-10 flex-col md:flex-row min-h-screen'>
            <div className='w-full md:w-1/2 text-center flex justify-between flex-col gap-10'>
                <div >
                    <h1 className='font-bold text-blue-600 text-7xl md:text-9xl'>404</h1>
                    <p className='mt-1 md:mt-3 font-bold text-blue-600 text-2xl md:text-4xl'>Page not found</p>
                    <p className='mt-1 md:mt-5 text-blue-600 text-base md:text-2xl'>The page you're looking for doesn't exist</p>
                </div>
                <div className=''>
                    <button className='bg-blue-500 text-sm md:rounded px-4 py-2 text-white font-bold'>Go to Home Screen</button>
                </div>
            </div>
        <div className='w-full md:w-1/2'>
            <img src={errorImg} alt="" />
        </div>
       </div>
  )
}

export default Error404Page
