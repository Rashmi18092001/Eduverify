import React from 'react'

const Page_name = ({name, tagline}) => {
  return (
    <div className=''>
      <h1 className='font-bold text-xl md:text-3xl text-gray-600'>{name}</h1>
      <p className='text-base md:text-base text-gray-700 mt-1'>{tagline}</p>
    </div>
  )
}

export default Page_name
