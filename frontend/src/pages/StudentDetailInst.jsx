import React, {useState} from 'react'
import Logo from '../components/Logo'
import { Eye } from 'lucide-react';
import { Ban } from 'lucide-react'; 
import { Download } from 'lucide-react';
import SidebarTab from '../components/SidebarTab';
import { Menu } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';


const StudentDetailInst = () => {
    const table = [
        { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
        { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
        { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    ]

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Students");
    const [details, setDetails] = useState({});
    
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const stud_id = queryParams.get("id");

    console.log("Student ID:", stud_id);

    useEffect(()=>{
        const fetchDetails = async ()=>{
            try {
                
                const response = await fetch(`http://localhost:3000/v1/student/fetch_single_student?stud_id=${stud_id}`, {
                    credentials: 'include',
                    method: 'GET'
                })

                const data = await response.json()
                console.log('data-----', data.data);
                

                if(data.status){
                    setDetails(data.data)
                }             
                
            } catch (error) {
                console.log(error);                
            }
        }
        fetchDetails()
    }, [])

  return (
    // <div className=' md:py-10 pb-10'>
        <div className='flex h-screen overflow-hidden'>
            <div className='w-1/5 justify-start '>
            {/* <Logo/> */}
                <SidebarTab 
                    open={open} 
                    setOpen={setOpen} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                />
            </div>

            <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-5 pb-10'>
                <div className="flex items-center w-full px-5 py-2 md:hidden">

                    <div className="flex-1">
                        <div onClick={() => setOpen(!open)} className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black">
                            <Menu />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <Logo />
                    </div>

                    <div className="flex-1"></div>
                                
                </div>

                <div className='md:px-20 px-5'>
                    {/* profile */}
                <div className='w-full h-full px-5 pb-10 md:py-10 flex gap-10 md:gap-30 flex-col items-center md:flex-row'>
                    {/* photo */}
                    <div className='w-50 h-50  rounded-full border-2 '>
                        <img src={details?.profile_picture} alt="" />
                    </div>
                    {/* details */}
                    <div className=''>
                        <div className='mb-5 md:mb-10'>
                            <h2 className='text-2xl md:text-4xl font-bold text-gray-700 text-center md:text-left'>{details?.name}</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-4'>
                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Course:</p>
                                    <p className='text-gray-700 text-base md:text-[1.1rem] font-semibold'> {details?.course_details?.name}</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Batch:</p>
                                    <p className='text-gray-700 text-base md:text-[1.1rem] font-semibold'>{details?.batch}</p>
                                </div>
                            {/* </div> */}

                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Email:</p>
                                    <p className='text-gray-700 text-base md:text-[1.1rem] font-semibold'>{details?.user_details?.email}</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Address:</p>
                                    <p className='text-gray-700 text-base md:text-[1.1rem] font-semibold'>{details?.address}</p>
                                </div>
                            {/* </div> */}

                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-6'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Phone:</p>
                                    <p className='text-gray-700 text-base md:text-[1.1rem] font-semibold'>{details?.phone_no}</p>
                                </div>
                            {/* </div> */}
                            
                        </div>
                    </div>
                </div>

                {/* certificates */}
                <div className='border-2 border-gray-300 rounded  '>
                    <div className=' bg-gray-50 '>
                        <div className='flex justify-between items-center px-3 py-4'>
                            <div>
                                <h2 className='text-base md:text-xl font-semibold text-gray-700'>Certificates</h2>
                            </div>
                        </div>
                        
                    </div>

                    <div className='border border-gray-300 rounded-lg flex-nowrap overflow-hidden  '>
                                <div className='w-full overflow-x-auto'>
                                    <table className='min-w-[700px] md:w-full border-collapse'>
                                        <thead >
                                            <tr className='bg-gray-100 rounded'>
                                                <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Certificate</th>
                                                <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Issue date</th>
                                                <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Expiry date</th>
                                                <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Status</th>
                                                <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {table.map((tr, index)=>{
                                                // console.log(tr);
                                                
                                                return (
                                                    <tr key={index} className='border-b-2 border-gray-300'>                        
                                                        <td className='text-left text-sm md:text-[1.1rem] font-medium py-2 px-3 text-gray-700'>{tr.name}</td>
                                                        <td className='text-left text-sm md:text-[1.1rem] font-medium text-gray-700'>{tr.issue_date}</td>
                                                        <td className='text-left text-sm md:text-[1.1rem] font-medium text-gray-700'>{tr.expiry_date}</td>
                                                        <td className={`text-left text-sm md:text-[1.1rem] font-medium ${tr.status == "Expired" ? 'text-red-700' : 'text-green-600'}`}>{tr.status}</td>                        
                                                        <td>
                                                            <div className='flex gap-5'>
                                                                <div><Eye size={16} color="#19a5e1" /></div>
                                                                <div><Download size={16} color="#0d5caf" /></div>
                                                                <div><Ban size={16} color="#e11919" /></div>
                                                            </div>  
                                                        </td>   
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                    </div>
                    
                </div>
                </div>
            </div>
        </div>    
  )
}

export default StudentDetailInst
