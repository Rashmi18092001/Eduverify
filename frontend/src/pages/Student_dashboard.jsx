import React, { useEffect, useState } from 'react'
import Page_name from '../components/Page_name';
import { Bell, Eye } from 'lucide-react';
import { Menu } from 'lucide-react';
import Student_card from '../components/Student_card';
import StudentSidebarTab from '../components/Student_sidebar';
import Logo from '../components/Logo';
import { Link, useNavigate } from 'react-router-dom';
import UserImage from '../images/dummy_user.png'


const Student_dashboard = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("My Dashboard");
    const [data, setData] = useState([]);

    const navigate = useNavigate()

    useEffect(()=>{
        const fetchData = async() => {
            try {
                // const response = await fetch('http://localhost:3000/v1/student/fetch_student', {
                const response = await fetch('https://eduverify.onrender.com/v1/student/fetch_student', {
                    credentials: 'include',
                    method: 'GET'
                })
                let data = await response.json();
                console.log('datasssss', data);
                
                if(data.status){
                    let lastCertificates = data.data.certificates.slice(-5).reverse()
                    setData({...data.data, certificates: lastCertificates})
                }
                
            } catch (error) {
                console.log(error);                
            }            
        }
        fetchData()
    }, [])

       
    const table = [
        {certificate: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
        {certificate: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
        {certificate: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    ]

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* <div className='w-1/5 h-screen bg-gray-50 hidden md:block'> */}
      
       <StudentSidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />
      
        <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-10 md:pr-10 pb-10 '>
            <div className='flex justify-between flex-col md:flex-row'>
                <div className='md:order-1 order-3 md:text-left text-center'>
                    <h2 className='font-semibold text-xl md:mb-2 mt-5 md:mt-10'>Welcome Back,</h2>
                    <Page_name name={data.name} tagline="Here's your certificate overview"/>
                </div>
                <div className='flex justify-end md:justify-between md:gap-6 gap-2 items-center md:order-2 order-2 '>
                    <span onClick={()=> {navigate('/student/profile')}} className='border-2 border-gray-400 py-1 px-4 rounded text-gray-700 text-sm font-semibold cursor-pointer'>{data.name}</span>
                    <Bell size={25} color="#5a5858" />
                    {/* profile */}
                    <div className='w-10 h-10 rounded-full border-2 border-gray-500 overflow-hidden'>
                        <img src={data.profile_picture || UserImage} alt="" className='w-full h-full object-cover' />
                    </div>
                </div>

                <div className="flex items-center w-full md:order-0 order-1 py-2 md:hidden">

                    <div className="flex-1">
                        <div
                        onClick={() => setOpen(!open)}
                        className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black"
                        >
                        <Menu />
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <Logo />
                    </div>

                    <div className="flex-1"></div>
                    
                </div>
            </div>

            <div className='my-10 md:pb-0 pb-6 flex md:justify-between justify-center items-center flex-wrap gap-5'>
                <Student_card tag={'Total Certificates'} num={data.total_certificates}/>
                <Student_card tag={'Active Certificates'} num={data.active_certificates}/>
                <Student_card tag={'Expired Certificates'} num={data.expired_certificates}/>
            </div>

            <div className=''>
                <div className='flex justify-between '>
                    <div>
                        <h2 className='font-semibold text-xl text-gray-700'>Recent Certificates</h2>
                    </div>
                    {/* <div>
                        <a href="" className='text-blue-600'>View all &gt;</a>
                    </div> */}
                    {
                        data?.certificates?.length > 0 && (
                            <div>
                                <Link to='/student/certificates' className='text-blue-600'>View all &gt;</Link>
                            </div>
                        )
                    }
                </div>

            {
                data?.certificates?.length == 0 ? 
                (<p className="text-center py-6 text-gray-500">No data available</p>)
                : 
                (
                    <div className='border border-gray-300 rounded-lg overflow-hidden mt-5 w-full overflow-x-auto '>
                <table className='min-w-175 md:w-full border-collapse'>
                    <thead >
                        <tr className='bg-gray-200 rounded-xl'>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Certificate</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Issue date</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Expiry date</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Status</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data?.certificates?.map((tr, index)=>{
                            // console.log(tr);
                            
                            return (
                                <tr key={index} className='border-b-2 border-gray-300'>                    
                                    <td className='text-left text-sm md:text-base py-2 px-3 font-medium text-gray-700'>{tr.course_name}</td>
                                    <td className='text-left text-sm md:text-base py-2 px-3 font-medium text-gray-700'>{tr.issue_date}</td>
                                    <td className='text-left text-sm md:text-base py-2 px-3 font-medium text-gray-700'>{tr.expiry_date}</td>
                                    <td className={`text-left text-sm md:text-base py-2 px-3 font-medium ${tr.status == "expired" || tr.status == "revoked" ? 'text-red-700' : 'text-green-600'}`}>{tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}</td>       
                                    <td className='py-2 px-3'>
                                        <div className='flex gap-5'>
                                            <div className='cursor-pointer' onClick={()=>{window.open(tr.certificate_url, "_blank")}}>
                                                <Eye size={16} color="#19a5e1" />
                                            </div>
                                        </div>  
                                    </td>                 
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                    </div>
                )
            }
            
            </div>
        </div>
      </div>
  )
}

export default Student_dashboard
