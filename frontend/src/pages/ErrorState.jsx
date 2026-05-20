import React from 'react'
import warning from '../images/warning.png'

const ErrorState = () => {
  return (
    <div className='flex justify-center items-center flex-col w-full min-h-screen'>
      <div>
        <img src={warning} className='w-80 h-80' alt="" />
      </div>
      <div className='text-center'>
        <h2 className='text-2xl md:text-4xl font-bold text-gray-700'>Something went wrong!</h2>
        <p className='text-sm md:text-base text-gray-500 my-2 '>We couldn't process your request. Please try Again</p>
        <button className='bg-blue-500 rounded text-sm md:text-base px-4 py-2 text-white font-bold'>Try again</button>
      </div>
    </div>
  )
}

export default ErrorState
