import React from 'react'
import { House } from 'lucide-react';
const Tab = ({icon: Icon, label, to, active, onClick}) => {
  return (
    <div onClick={onClick} className='cursor-pointer flex justify-start gap-3 items-center px-10 py-3 mb-1 md:mb-3 rounded-xl active:bg-blue-200 font-semibold text-sm md:text-base'>
      <Icon color={active ? "#2563eb" : "#5a5858"} />

      <p className={active ? "text-blue-600 font-semibold" : "text-gray-800"}>
        {label}
      </p>
    </div>
  )
}

export default Tab
