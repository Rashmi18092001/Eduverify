import React, { useState }  from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { UserPlus } from 'lucide-react';
import { Search } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Logo from '../components/Logo';
import { useEffect } from 'react';

const StudentList = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Students");
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    
    const navigate = useNavigate()

    const handleBanConfirm = async () => {
        await revokeStudent(selectedStudentId);

        setShowOverlay(false);
        setSelectedStudentId(null);
        
    };

    const handleBanCancel = () => {
        setShowOverlay(false);
        setSelectedStudentId(null);
    };

    useEffect(()=>{

        const fetchList = async() => {

            // let url = `http://localhost:3000/v1/student/fetch_student_by_search?page=${page}`
            let url = `https://eduverify.onrender.com/v1/student/fetch_student_by_search?page=${page}`

            if(search.trim != ""){
                url += `&search=${search}`
            }
            const response = await fetch(url, {
                credentials: 'include',
                method: 'GET'
            })

            const data = await response.json()
            
            if(data.status){
                setList(data.data)
                setTotalPages(data.total_pages)
            } else{
                setList([])
            }
        }
        fetchList()
    }, [page, search])

    const revokeStudent = async(id) => {
        console.log('revokeStudent', id);
        
        // const response = await fetch('http://localhost:3000/v1/student/revoke_student', {
        const response = await fetch('https://eduverify.onrender.com/v1/student/revoke_student', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                student_id: id
            })
        })

        const data = await response.json()
        console.log('revoke data', data);
        
        if(data.status){
            setList((prev) =>
                prev.map((student) =>
                    student._id === id
                        ? { ...student, status: "revoked" }
                        : student
                )
            );
        } else{
            alert(data.message)
        }
    }
    

    return (
        <div className='flex h-screen overflow-hidden'>
        <SidebarTab 
                open={open} 
                setOpen={setOpen} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            <div className='w-full md:w-4/5 h-screen overflow-y-auto md:px-10 px-5 md:py-10 pb-5 mx-auto flex flex-col'>
                <div className='flex md:items-center md:flex-row flex-col justify-between gap-5 md:gap-0'>
                    
                <div className="flex items-center w-full md:order-0 py-2 md:hidden">

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

                <Page_name name="Students" tagline="Manage all students in your institution"/>

                    <div className='flex items-center gap-3'>
                        <div className='flex items-center border-2 border-gray-300 rounded md:py-1.5 px-2 gap-2 py-1 text-sm md:text-base w-1/2'>
                            <Search size={17} color="#a09898"/>
                            <input 
                            type="text" 
                            placeholder='Search students' 
                            className='w-full outline-none bg-transparent text-sm md:text-base'
                            onChange={(e) => {setSearch(e.target.value)}}
                        />
                        </div>

                        <Link to='/add_student' className='flex items-center gap-2 border-2 border-blue-500 md:border-0  bg-blue-500 text-white px-3 md:py-2 py-1 rounded text-sm md:text-base hover:bg-blue-600 hover:border-blue-600'>
                            <UserPlus size={18} />
                            <span>Add Student</span>
                        </Link>

                    </div>
                </div>

                <div className='flex-1 mt-5'>
                  
                    
                    {(list.length == 0  ) ? (
                        <p className="text-center py-6 text-gray-500">No data available</p>) : (
                            <div className='border border-gray-300 rounded-lg shrink-0 flex-nowrap overflow-hidden mt-5 '>
                                <div className='w-full overflow-x-auto'>
                                    <table className='min-w-175 md:w-full border-collapse'>
                                        <thead >
                                            <tr className='bg-gray-200 rounded-xl'>
                                                <th className='font-semibold text-[1.1rem] py-2 px-3 text-left text-gray-800'>#</th>
                                                <th className='font-semibold text-[1.1rem] py-2 text-left text-gray-800'>Name</th>
                                                <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Email</th>
                                                <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Phone No.</th>
                                                <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Batch</th>
                                                <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {list.map((tr, index)=>{
                                                return (
                                                    <tr onClick={() => navigate(`/student_detail?id=${tr._id}`)} key={index} className={`border-b-2 border-gray-300 cursor-pointer ${tr.status == 'revoked' ? 'bg-red-200' : ""}`}>
                                                        <td className='text-left py-2 px-3 font-medium text-gray-700'>{index+1}</td>                        
                                                        <td className='text-left py-2 font-medium text-gray-700'>{tr.name}</td>
                                                        <td className='text-left py-2 font-medium text-gray-700'>{tr.user_details.email}</td>
                                                        <td className='text-left py-2 font-medium text-gray-700'>{tr.user_details.phone}</td>
                                                        <td className='text-left py-2 font-medium text-gray-700'>{tr.batch}</td>
                                                        <td>
                                                        <div className='flex gap-5'>
                                                            <div><Eye size={16} color="#19a5e1" /></div>

                                                            <div className={`${tr.status == "active" ? "block" : "hidden"}`} onClick={(e)=> {
                                                                    e.stopPropagation();
                                                                    // revokeStudent(tr._id)
                                                                    setSelectedStudentId(tr._id);
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
                        )
                    } 
                </div>
                
                
                {totalPages > 1 && (
                     <div className='flex justify-center items-center gap-10'>
                       
                        <button disabled={page === 1 } style={{opacity: page === 1? 0.5: 1}} className='cursor-pointer border-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1 active:scale-95' onClick={()=>{
                            if(page > 1){
                                setPage(prev => prev-1)
                                setList([])
                            }
                        }}>Prev</button>
                        <p>{page}</p>
                        <button disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.5 : 1 }} className='cursor-pointer border-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1 active:scale-95' 
                            onClick={()=>{
                                setPage(prev => prev +1 )
                                setList([])
                            }}>
                            Next
                        </button>
                    </div>
                    )
                }
                
            </div>

            {showOverlay && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white w-[400px] p-6 rounded-2xl shadow-2xl text-center">

                        <h2 className="text-2xl font-bold text-gray-800">
                            Revoke Student?
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Are you sure you want to revoke this student?
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
{/* <div id="right" class="h-full overflow-x-auto flex flex-nowrap gap-10 p-4  w-2/3 "><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">1</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae enim fugiat, repellendus inventore dolores provident tenetur nisi quas fugit. Sapiente!</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: royalblue;">Satisfied</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: royalblue;"><i class="ri-arrow-right-line"></i></button></div></div></div></div><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://plus.unsplash.com/premium_photo-1661641353075-f0eaf2d82aae?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">2</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus deleniti id suscipit exercitationem magnam assumenda eos modi placeat doloremque aliquam?</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: lightseagreen;">Underserved</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: lightseagreen;"><i class="ri-arrow-right-line"></i></button></div></div></div></div><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://plus.unsplash.com/premium_photo-1661769159995-f3af0089875f?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">3</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam nesciunt sint ratione iusto eos quo reiciendis quam error corporis? Odit!</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: pink;">Underbanked</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: pink;"><i class="ri-arrow-right-line"></i></button></div></div></div></div></div> */}
export default StudentList
