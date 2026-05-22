import React, {useState} from 'react'
import Logo from '../components/Logo'
import { Eye } from 'lucide-react';
import { Ban } from 'lucide-react'; 
import { Download } from 'lucide-react';
import SidebarTab from '../components/SidebarTab';
import { Menu } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserImage from '../images/dummy_user.png'


const StudentDetailInst = () => {
    // const table = [
    //     { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    //     { name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
    // ]

    let navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Students");
    const [details, setDetails] = useState({});
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedCertificateId, setSelectedCertificatId] = useState(null);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const stud_id = queryParams.get("id");

    // console.log("Student ID:", stud_id);
    const handleBanConfirm = async () => {
        await revokeCertificate(selectedCertificateId);

        setShowOverlay(false);
        setSelectedCertificatId(null);
        
    };

    const handleBanCancel = () => {
        setShowOverlay(false);
        setSelectedCertificatId(null);
    };

    const fetchDetails = async ()=>{
        try {
                
            // const response = await fetch(`http://localhost:3000/v1/student/fetch_single_student?stud_id=${stud_id}`, {
            const response = await fetch(`https://eduverify.onrender.com/v1/student/fetch_single_student?stud_id=${stud_id}`, {
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

    useEffect(()=>{        
        fetchDetails()
    }, [])

    const revokeCertificate = async(id) => {
        console.log('revokeCertificate', id);
        
        // const response = await fetch('http://localhost:3000/v1/institution/revoke_certificate', {
        const response = await fetch('https://eduverify.onrender.com/v1/institution/revoke_certificate', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                certificate_id: id
            })
        })

        const data = await response.json()
        console.log('revoke data', data);
        
        if(data.status){
            await fetchDetails();
            // setList((prev) =>
            //     prev.map((student) =>
            //         student._id === id
            //             ? { ...student, status: "revoked" }
            //             : student
            //     )
            // );
        } else{
            alert(data.message)
        }
    }

  return (
    // <div className=' md:py-10 pb-10'>
        <div className='flex h-screen overflow-hidden'>
            <div className=''>
            {/* <Logo/> */}
                <SidebarTab 
                    open={open} 
                    setOpen={setOpen} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                />
            </div>

            <div  className='w-full md:w-4/5 h-screen overflow-y-auto  md:px-10 md:py-5 pb-10'>
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
                <div className='w-full h-full px-5 pb-10 md:py-10 flex gap-10 md:gap-30 flex-col items-center md:flex-row '>
                    {/* photo */}
                    <div className='w-50 h-40  rounded-[50%] border-2 overflow-hidden object-cover'>
                        <img src={details?.profile_picture || UserImage} alt="" />
                    </div>
                    {/* details */}
                    <div className=''>
                        <div className='mb-5 md:mb-10'>
                            <h2 className='text-2xl md:text-4xl font-bold text-gray-700 text-center md:text-left'>{details?.name}</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-4'>
                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Batch:</p>
                                    <p className='text-gray-700 text-base font-semibold'>{details?.batch}</p>
                                </div>
                            {/* </div> */}

                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Email:</p>
                                    <p className='text-gray-700 text-base font-semibold'>{details?.user_details?.email}</p>
                                </div>
                                <div className='flex gap-4'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Address:</p>
                                    <p className='text-gray-700 text-base font-semibold'>{details?.address}</p>
                                </div>
                            {/* </div> */}

                            {/* <div className='flex justify-between items-center mb-3'> */}
                                <div className='flex gap-6'>
                                    <p className='text-gray-800 font-medium text-base md:text-[1.1rem]'>Phone:</p>
                                    <p className='text-gray-700 text-base font-semibold'>{details?.phone_no}</p>
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
                            {
                                details?.certificates?.length > 0 && (
                                    <div>
                                        <button 
                                            onClick={()=>
                                                {
                                                    console.log('navigating');
                                                    
                                                    navigate('/certificates', {
                                                        state: {
                                                            student_id: details?._id.toString(),
                                                            student_name: details?.name
                                                        }
                                                    })
                                                }} 
                                            className='text-blue-600 cursor-pointer'>View all &gt;
                                        </button>
                                    </div>
                                )
                            }
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
                                            {/* {console.log('certsss---', details?.certificates.length)} */}
                                            { details?.certificates?.slice(0, 3).map((tr, index)=>{
                                                console.log('tr', tr);
                                                
                                                return (
                                                    <tr key={index} className='border-b-2 border-gray-300'>                        
                                                        <td className='text-left text-sm md:text-base font-medium py-2 px-3 text-gray-700'>{tr.course_details.name}</td>
                                                        <td className='text-left text-sm md:text-base font-medium text-gray-700'>{tr.issue_date}</td>
                                                        <td className='text-left text-sm md:text-base font-medium text-gray-700'>{tr.expiry_date}</td>
                                                        <td className={`text-left text-sm md:text-base font-medium ${tr.status == "expired" || tr.status == "revoked" ? 'text-red-700' : 'text-green-600'}`}>{tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}</td>                        
                                                        <td>
                                                            <div className='flex gap-5'>
                                                                <div><Eye size={16} color="#19a5e1" /></div>
                                                                <div><Download size={16} color="#0d5caf" /></div>
                                                                {/* <div><Ban size={16} color="#e11919" /></div> */}
                                                                <div className={`${tr.status == "active" ? "block" : "hidden"}`} 
                                                                    onClick={(e)=> {
                                                                        e.stopPropagation();
                                                                        // revokeCertificate(tr._id.toString())
                                                                        setSelectedCertificatId(tr._id);
                                                                        setShowOverlay(true);
                                                                    }}>
                                                                    <Ban size={16} color="#e11919" />
                                                                </div>
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

            {showOverlay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[400px] p-6 rounded-2xl shadow-2xl text-center">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Revoke Certificate?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Are you sure you want to revoke this certificate?
                        </p>

                        <div className="flex justify-center gap-4 mt-6">

                            <button
                                onClick={handleBanConfirm}
                                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            >
                                Yes
                            </button>

                            <button
                                onClick={handleBanCancel}
                                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            >
                                No
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>    
  )
}

export default StudentDetailInst
