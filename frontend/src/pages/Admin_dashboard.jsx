import React from 'react'
import Admin_card from '../components/Admin_card'

const Admin_dashboard = () => {
  return (
    <div className='bg-[#F7F9FC] flex flex-col justify-between px-15 py-10 md:flex-row'>
      {/* sidebar */}
      <div className='w-full md:w-120 md:min-h-[50vh] flex-col justify-between px-5'>
        <div className='max-h-[50vh] min-h-[50vh] scroll-smooth scrollbar-thin overflow-y-auto flex flex-col gap-2 items-center rounded'>
            {/* list */}
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            {/* <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/>
            <Admin_card/> */}
           
        </div>
        

        {/* pagination */}
        <div className='my-5 flex justify-center items-center gap-5'>
            <button className='text-sm px-5 py-2 rounded bg-amber-500'>Prev</button>
            <p>1</p>
            <button className='text-sm px-5 py-2 rounded bg-amber-500'>Next</button>
        </div>
      </div> 

        
      
      <div className='hidden md:block border-x-2 border-gray-300'></div>
      {/* information of single */}
      <div className='md:w-screen rounded-3xl mx-5 border-gray-300 border-2 py-2'>
        <div className=' flex justify-items-start md:items-start items-center gap-5 md:gap-30 h-full flex-col md:flex-row md:m-10 md:p-10 m-2 p-2'>
            {/* profile */}
            {/* <div className='w-32 h-32 md:w-50 md:h-50 rounded-full overflow-hidden border-2 border-gray-600'> */}
            <div className='overflow-hidden md:w-50 md:h-50 rounded-full border-2 border-gray-600 shadow-lg shadow-black/50 w-40 h-40'>
                <img className='w-screen h-full object-cover' src="https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2ZmaWNlJTIwYnVpbGRpbmd8ZW58MHx8MHx8fDA%3D" alt="" />
            </div>
            {/* details */}
            <div className='md:py-10 py-5 text-center'>
                <h2 className='text-[#171f29] text-3xl md:text-5xl font-semibold text-gr'>CADD Center</h2>
                <p className='text-sm md:text-lg py-2 text-[#1F2937]'>Address: Nandanwan Square, Nagpur</p>
            </div>
        </div>
      </div>
    </div>


//   <div className='bg-[#F7F9FC] flex flex-col md:flex-row gap-5 px-5 md:px-15 py-10'>

//   {/* Sidebar */}
//   <div className='md:w-80 w-full flex flex-col justify-between'>
//     <div className='max-h-[40vh] overflow-y-auto flex flex-col gap-2 items-center'>
//       <Admin_card/>
//       <Admin_card/>
//       <Admin_card/>
//     </div>

//     <div className='mt-5 flex justify-center items-center gap-4'>
//       <button className='text-sm px-5 py-2 rounded bg-amber-500'>Prev</button>
//       <p>1</p>
//       <button className='text-sm px-5 py-2 rounded bg-amber-500'>Next</button>
//     </div>
//   </div>

//   {/* Divider */}
//   <div className='hidden md:block border-x-2 border-gray-300'></div>

//   {/* Main Content */}
//   <div className='flex-1 rounded-3xl mx-2 border-gray-300 border-2'>
//     <div className='flex flex-col md:flex-row gap-6 m-5 p-5'>

//       {/* Profile */}
//       <div className='w-32 h-32 md:w-50 md:h-50 rounded-full overflow-hidden border-2 border-gray-600'>
//         <img
//           className='w-full h-full object-cover'
//           src="https://images.unsplash.com/photo-1574958269340-fa927503f3dd"
//           alt=""
//         />
//       </div>

//       {/* Details */}
//       <div>
//         <h2 className='text-2xl md:text-5xl font-semibold'>CADD Center</h2>
//         <p className='text-sm md:text-lg py-2'>Address: Nandanwan Square, Nagpur</p>
//       </div>

//     </div>
//   </div>

// </div>
  )
}

export default Admin_dashboard
