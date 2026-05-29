import React from 'react'

const Student_card = ({tag, num}) => {
  return (
    <div className='h-30 w-60 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.2)] px-6 py-6 '>
      <h3 className='font-semibold text-gray-800 text-[1.1rem] md:text-left text-center'>{tag}</h3>
      <h3 className='font-bold text-gray-800 text-[1.7rem] md:text-left text-center'>{num}</h3>
    </div>
  )
}

export default Student_card
