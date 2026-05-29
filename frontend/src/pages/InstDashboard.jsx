import React, { useState, useEffect } from 'react'
import Page_name from '../components/Page_name';
import { Bell } from 'lucide-react';
import { Menu } from 'lucide-react';
import Logo from '../components/Logo';
import Student_card from '../components/Student_card';
import SidebarTab from '../components/SidebarTab';
import { useNavigate } from 'react-router-dom';
import buildingImage from '../images/building.png'

const InstDashboard = () => {

    let navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [stats, setStats] = useState(null);
    const [tableData, setTableData] = useState([])

    // const table = [
    //     {stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     {stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},{stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},{stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},{stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     {stud_name: "Jane Smith", name: "Data Science", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     {stud_name: "Michael Brown", name: "UI/UX Design", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     {stud_name: "Emily Johnson", name: "Digital Marketting", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Expired"},
    //     {stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},

    // ]

    useEffect(() => {
        console.log('fetching stats');
        
        const fetchStats = async() => {
            try {
                
                // const response = await fetch('http://localhost:3000/v1/institution/stats',  {
                const response = await fetch('https://eduverify.onrender.com/v1/institution/stats',  {
                    credentials: 'include',
                })
                // console.log('response', response);
                const data = await response.json();
                console.log('data', data);


                if (data.status) {
                    setStats(data.data); // 👈 store actual data
                }

            } catch (error) {
                console.error(err);
            }
        }

        fetchStats();

    }, [])

    useEffect(()=>{
        const fetchTableData = async() => {
            console.log('fetchInstitutionCertificates');
            
            try {
                
                // const response = await fetch('http://localhost:3000/v1/institution/fetch_institution_certificates',  {
                const response = await fetch('https://eduverify.onrender.com/v1/institution/fetch_institution_certificates',  {
                    credentials: 'include',
                    method: 'GET'
                })

                const data = await response.json();
                // console.log('dataaaa', data.data.length);
                let newData = data.data?.splice(0, 3)
                // console.log("newww", newData);
                
                if(data.status){
                    setTableData(newData)
                }
            } catch (error) {
                console.log(error);                
            }
        }
        fetchTableData();
    }, [])
    
  return (        
    
    
      <div className='flex h-screen overflow-hidden'>
      {/* <div className='w-1/5 h-screen bg-gray-50 hidden md:block'> */}
      
       <SidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />
     
        <div  className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-10 pb-10'>
            <div className='flex justify-between flex-col md:flex-row'>
                <div className='md:order-1 order-3 md:text-left text-center'>
                    <h2 className='font-semibold text-base md:text-xl md:mb-2'>Welcome Back,</h2>
                    <Page_name name={stats?.institution_data?.institutionName} tagline="Here's what's happening with your institution"/>
                </div>
                
                <div className='flex justify-end md:justify-between md:gap-6 gap-2 items-center md:order-2 order-2 '>
                    <span className='border-2 border-gray-400 py-1 px-4 rounded text-gray-700 text-sm font-semibold'>{stats?.institution_data?.institutionName}</span>
                    {/* profile */}
                    <div className='w-10 h-10 rounded-full border-2 bg-blue-900 overflow-hidden'>
                        <img src={stats?.institution_data?.institution_logo || buildingImage} alt="" className='w-full h-full object-cover' />
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
                <Student_card tag={'Total Students'} num={stats?.total_students || 0}/>
                <Student_card tag={'Certificates Issued'} num={stats?.certificates_issued || 0}/>
                <Student_card tag={'Active Certificates'} num={stats?.active_students || 0}/>
                <Student_card tag={'Expired Certificates'} num={stats?.expired_students || 0}/>
            </div>

            <div className=''>
                <div className='flex justify-between '>
                    <div>
                        <h2 className='font-semibold text-xl text-gray-700'>Recent Certifications</h2>
                    </div>
                    {
                        tableData?.length > 0 && (
                            <div>
                                <a href="" onClick={()=>{navigate('/certificates')}} className='text-blue-600'>View all &gt;</a>
                            </div>
                        )
                    }
                    {/* <div>
                        <a href="" className='text-blue-600'>View all &gt;</a>
                    </div> */}
                </div>

        {tableData?.length == 0 ? (
            <p className="text-center py-6 text-gray-500">No data available</p>
        ) : (
             <div className='border border-gray-300 rounded-lg overflow-hidden mt-5 '>
                <div className='w-full overflow-x-auto'>
                    <table className='min-w-[700px] md:w-full border-collapsee'>
                    <thead >
                        <tr className='bg-gray-200 rounded-xl'>
                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Student name</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Certificate</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Issue date</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Expiry date</th>
                            <th className='font-semibold text-sm md:text-[1.1rem] text-left text-gray-800'>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((tr, index)=>{
                            // console.log(tr);
                            
                            return (
                                <tr key={index} className='border-b-2 border-gray-300'>                        
                                    <td className='text-left text-sm md:text-base py-2 px-3 font-medium text-gray-700'>{tr.student_name}</td>
                                    <td className='text-left text-sm md:text-base font-medium text-gray-700'>{tr.course_name}</td>
                                    <td className='text-left text-sm md:text-base font-medium text-gray-700'>{tr.issue_date.split("T")[0]}</td>
                                    <td className='text-left text-sm md:text-base font-medium text-gray-700'>{tr.expiry_date.split("T")[0]}</td>
                                    <td className={`text-left text-sm md:text-base font-medium ${tr.status == "expired" || tr.status == "revoked" ? 'text-red-700' : 'text-green-600'}`}>{tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}</td>                        
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                </div>
                
            </div>
        )}
           
            </div>
        </div>
      </div>

    
  )
}

export default InstDashboard
