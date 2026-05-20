import React , {useState} from 'react'
import SidebarTab from '../components/SidebarTab';
import Page_name from '../components/Page_name';
import { Search, Funnel } from 'lucide-react';
import { Eye, Menu } from 'lucide-react';
import { Download } from 'lucide-react';
import Logo from '../components/Logo';
import { useEffect } from 'react';

const Issued_certificate = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Certificates");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(1);


  useEffect(()=>{
    const fetchData = async() => {
        try {
            
            let url = `http://localhost:3000/v1/institution/fetch_institution_certificates?page=${page}`;
            if(search){
                url += `&search=${search}`
            }
            const response = await fetch(url, {
                credentials: 'include',
                method: 'GET'
            })

            let data = await response.json();
            console.log('data', data);
            
            if(data.status){
                setData(data.data)
                setTotalPages(data.total_pages)
            } else{
                setData([])
            }
        } catch (error) {
            console.log(error);            
        }
    }
    fetchData()
  }, [page, search])

   const handleDownload = async(fileurl, name) => {
    const response = await fetch(fileurl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a')
    a.href = url;
    a.download = name;

    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url)
  }

//   const table = [
//         {no:1, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:2, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:3, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:4, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:5, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:6, stud_name: "Jane Smith", name: "Data Science", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:7, stud_name: "Michael Brown", name: "UI/UX Design", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//         {no:8, stud_name: "Emily Johnson", name: "Digital Marketting", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Expired"},
//         {no:9, stud_name: "John Smith", name: "Web Development", issue_date: "4 May 2024", expiry_date: "3 May 2025", status: "Active"},
//     ]

  return (
    <div className='flex h-screen overflow-hidden '>
      {/* left part */}
      <SidebarTab 
            open={open} 
            setOpen={setOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
        />

        

      {/* right part */}
      <div className='w-full md:w-4/5 h-screen overflow-y-auto px-5 md:px-10 md:py-10 pb-5 mx-auto flex flex-col'>
        <div className='md:flex md:justify-between md:items-center block '>
        
            <div className="flex items-center w-full py-2 md:hidden">

                <div className="flex-1">
                <div onClick={() => setOpen(!open)} className="md:hidden w-fit px-1 py-1 bg-gray-300 rounded text-black" >
                    <Menu />
                </div>
                </div>

                <div className="flex-1 flex justify-center">
                <Logo />
                </div>

                <div className="flex-1"></div>
                            
            </div>

            <div className='mb-5 md:mb-0'>
                <Page_name name="Certificates" tagline="View and manage all issued certificates"/>

            </div>

            <div className='flex gap-2 md:gap-10'>
                    <div className='flex items-center border-2 border-gray-300 rounded px-2 gap-2 '>
                        <Search size={17} color="#a09898"/>
                        <input 
                            type="text" 
                            placeholder='Search students' 
                            className='h-6 outline-none'
                            onChange={(e) => {setSearch(e.target.value)}}
                        />
                    </div>
                    <div>
                        <div className='flex items-center border-2 border-gray-300 rounded  px-2 gap-2 py-1 text-sm md:text-base '>
                            <div><Funnel size={16} /></div>
                            <div className='text-gray-700 font-semibold'>Filter</div>
                        </div>
                        
                    </div>
            </div>
            
        </div>

        <div className='flex-1 '>
            {/* table */}
            {data.length == 0 ? (
                <p className="text-center py-6 text-gray-500">No data available</p>
            ) : (
                <div className='border border-gray-300 rounded-lg flex-nowrap overflow-hidden mt-10 '>
                            <div className='w-full overflow-x-auto'>
                                <table className='min-w-[700px] md:w-full border-collapse'>
                                    <thead >
                                        <tr className='bg-gray-100 rounded'>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>#</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>Student name</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>Certificate</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>Issue date</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>Expiry date</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3  text-left text-gray-800'>Status</th>
                                            <th className='font-semibold text-sm md:text-[1.1rem] py-2 px-3 text-left text-gray-800'>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.map((tr, index)=>{
                                            // console.log(tr);
                                            
                                            return (
                                                <tr key={index} className='border-b-2 border-gray-300'>
                                                    <td className='text-left font-medium py-2 px-3 text-gray-700'>{index+1}</td>  
                                                    <td className='text-left font-medium py-2 px-3  text-gray-700'>{tr.student_name}</td>                      
                                                    <td className=' font-medium py-2 px-3 text-gray-700'>{tr.course_name}</td>
                                                    <td className='text-left font-medium py-2 px-3  text-gray-700'>{tr.issue_date}</td>
                                                    <td className='text-left font-medium py-2 px-3  text-gray-700'>{tr.expiry_date}</td>
                                                    <td className={`text-left py-2 px-3  font-medium ${tr.status == "expired" || tr.status == "revoked" ? 'text-red-700' : 'text-green-600'}`}>{tr.status.charAt(0).toUpperCase() + tr.status.slice(1)}</td>                        
                                                    <td className='py-2 px-3 '>
                                                        <div className='flex gap-5'>
                                                            <div className='cursor-pointer' onClick={()=>{window.open(tr.pdf_url, "_blank")}}><Eye size={16} color="#19a5e1" /></div>
                                                            <div onClick={()=>{
                                                                console.log('urlll-------', tr.pdf_url);
                                                                
                                                                handleDownload(tr.pdf_url, tr.pdf)}} className='cursor-pointer'>
                                                                <Download size={16} color="#0d5caf" />
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
            )}
        </div>

        {totalPages > 1 && (
            <div className='flex justify-center items-center gap-10 mt-10'>
                <button disabled={page === 1 } style={{opacity: page === 1? 0.5: 1}} className='cursor-pointer border-2 bg-blue-500 text-white rounded px-3 py-1 active:scale-95 hover:bg-blue-600' onClick={()=>{
                    if(page > 1){
                        setPage(prev => prev-1)
                        setData([])
                    }
                }}>Prev</button>
                <p>{page}</p>
                <button disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.5 : 1 }} className='cursor-pointer border-2 bg-blue-500 text-white rounded px-3 py-1 active:scale-95 hover:bg-blue-600' 
                    onClick={()=>{
                        setPage(prev => prev +1 )
                        setData([])
                    }}>
                    Next
                </button>
            </div>
        )}
      
      </div>
    </div>
  )
}

export default Issued_certificate
