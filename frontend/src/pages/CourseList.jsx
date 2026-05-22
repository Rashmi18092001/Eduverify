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

const CourseList = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Courses");
    const [list, setList] = useState([]);
    // const [total_pages, setTotal_pages] = (0);

    const navigate = useNavigate()

    useEffect(()=>{
        console.log('fetching list');

        const fetchList = async() => {

            const response = await fetch('https://eduverify.onrender.com/v1/course/fetch_all_course', {
                credentials: 'include',
                method: 'GET'
            })

            const data = await response.json()
            console.log('data', data.data);
            
            if(data.status){
                setList(data.data)
                // setTotal_pages(data.total_pages)
            }
        }
        fetchList()
    }, [])

    // const table = [
    //     {no: 1, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},
    //     {no: 2, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},
    //     {no: 3, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},
    //     {no: 4, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},
    //     {no: 5, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},
    //     {no: 6, name: "Jane Smith", email:"janesmith@gmail.com", course: "Data Science", branch: "2023-24"},
    //     {no: 7, name: "Michael Brown", email:"michaelbrown@gmail.com", course: "UI/UX Design", branch: "2023-24"},
    //     {no: 8, name: "Emily Johnson", email:"emilyjohnson@gmail.com", course: "Digital Marketting", branch: "2023-24"},
    //     {no: 9, name: "John Smith", email:"johnsmith@gmail.com", course: "Web Development", branch: "2023-24"},

    // ]

    return (
        <div className='flex h-screen overflow-hidden'>
        <SidebarTab 
                open={open} 
                setOpen={setOpen} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            <div className='w-full md:w-4/5 h-screen overflow-y-auto md:px-10 px-5 md:py-10 pb-5 mx-auto'>
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

                <Page_name name="Courses" tagline="Manage all courses of your institution"/>

                    <div className='flex items-center gap-3'>
                       
                        <Link to='/add_course' className='flex items-center gap-2 border-2 border-blue-500 md:border-0  bg-blue-500 text-white px-3 md:py-2 py-1 rounded text-sm md:text-base hover:bg-blue-600'>
                            <UserPlus size={18} />
                            <span>Add Course</span>
                        </Link>

                    </div>
                </div>

                {list.length == 0 ? (
                    <p className="text-center py-6 text-gray-500">No data available</p>) : (
                        <div className='border border-gray-300 rounded-lg shrink-0 flex-nowrap overflow-hidden mt-5 '>
                            <div className='w-full overflow-x-auto'>
                                <table className='min-w-175 md:w-full border-collapse'>
                                    <thead >
                                        <tr className='bg-gray-200 rounded-xl'>
                                            <th className='font-semibold text-[1.1rem] py-2 px-3 text-left text-gray-800'>#</th>
                                            <th className='font-semibold text-[1.1rem] py-2 px-3 text-left text-gray-800'>Course Name</th>
                                            <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Price</th>
                                            <th className='font-semibold text-[1.1rem] text-left text-gray-800'>Duration</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {list.map((tr, index)=>{
                                            // console.log('tr', tr);
                                            
                                            return (
                                                <tr onClick={() => navigate(`/course_detail?id=${tr._id}`)} key={index} className='border-b-2 border-gray-300'>
                                                    <td className='text-left py-2 px-3 font-medium text-gray-700'>{index+1}</td>                        
                                                    <td className='text-left py-2 px-3 font-medium text-gray-700'>{tr.name}</td>
                                                    <td className='text-left font-medium text-gray-700'>{tr.price}</td>
                                                    <td className='text-left font-medium text-gray-700'>{tr.duration}</td>            
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
    )
}
{/* <div id="right" class="h-full overflow-x-auto flex flex-nowrap gap-10 p-4  w-2/3 "><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">1</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae enim fugiat, repellendus inventore dolores provident tenetur nisi quas fugit. Sapiente!</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: royalblue;">Satisfied</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: royalblue;"><i class="ri-arrow-right-line"></i></button></div></div></div></div><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://plus.unsplash.com/premium_photo-1661641353075-f0eaf2d82aae?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">2</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus deleniti id suscipit exercitationem magnam assumenda eos modi placeat doloremque aliquam?</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: lightseagreen;">Underserved</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: lightseagreen;"><i class="ri-arrow-right-line"></i></button></div></div></div></div><div class="shrink-0 overflow-hidden h-full w-80 relative rounded-4xl "><img class="h-full w-full object-cover " alt="" src="https://plus.unsplash.com/premium_photo-1661769159995-f3af0089875f?w=600&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D"><div class="absolute top-0 left-0 h-full w-full p-8 flex flex-col justify-between "><h2 class="bg-white text-sm font-semibold rounded-full h-8 w-8 flex justify-center items-center">3</h2><div><p class="text-shadow-2xs text-lg leading-relaxed text-white mb-14">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam nesciunt sint ratione iusto eos quo reiciendis quam error corporis? Odit!</p><div class="flex justify-between"><button class="text-white font-medium px-8 py-2 rounded-full" style="background-color: pink;">Underbanked</button><button class="text-white font-medium px-3 py-2  rounded-full" style="background-color: pink;"><i class="ri-arrow-right-line"></i></button></div></div></div></div></div> */}
export default CourseList
