import React, {useState} from 'react'
import Logo from '../components/Logo'
import { X } from 'lucide-react';
import Tab from '../components/Tab'
import { House } from 'lucide-react';
import { Users } from 'lucide-react';
import { FilePlus } from 'lucide-react';
import { File } from 'lucide-react';
import { User } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";



const StudentSidebarTab = ({ open, setOpen, activeTab, setActiveTab }) => {

    const navigate = useNavigate();

    const [logoutSuccess, setLogoutSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
  

    
  const handleYes = async() => {
    setShowOverlay(true);
    
    try {
        let response = await fetch('http://localhost:3000/v1/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
        let data = await response.json();
        if(data.status){

            setLogoutSuccess(true)
            setMessage(data.message)

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else{
            setMessage("Logout Failed")
        }

    } catch (error) {
        console.log(error);
        
    }
  };

  const handleLogoutNo = () => {
    setShowOverlay(false);
  }

    const tabs = [
        { icon: House, label: "My Dashboard", path: "/student/dashboard" },
        { icon: File, label: "My Certificates", path: "/student/certificates" },
        { icon: User, label: "Profile", path: "/student/profile" },
        { icon: User, label: "Change Password", path: "/change_password" },
        { icon: LogOut, label: "Logout", path: "/logout" },

    ]

    function handleClick(tab) {
        console.log('path', tab.path);

        if(tab.label == 'Logout'){
            setShowOverlay(true)
            return; 
        }
        
        setActiveTab(tab.label);
        navigate(tab.path);   // 🔥 this does the redirect
        setOpen(true);       // optional (for mobile sidebar)
    }

  return (

    <div>
        <div className={`fixed top-0 left-0 h-screen w-64 md:w-80 bg-gray-50 z-50 transform transition-transform duration-300 
            ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
            >
        <Logo/>

            {/* tabs */}
            <div className="flex justify-end p-3 md:hidden">
                <button onClick={() => setOpen(false)}>
                    <X size={24} />
                </button>
                </div>

            <div className='w-full p-2'>
                {tabs.map((tab, index) => (
                    <Tab key={index} icon={tab.icon} label={tab.label} active={activeTab === tab.label} onClick={() => handleClick(tab)}/>
                ))}
            </div>
        </div>

        {showOverlay && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                <div className="bg-white w-[340px] p-6 rounded-2xl shadow-2xl text-center">

                    {!logoutSuccess ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Are you sure?
                            </h2>

                            <p className="text-gray-600 mt-2">
                                Do you really want to logout?
                            </p>

                            <div className="flex justify-center gap-4 mt-6">

                                <button
                                    onClick={handleYes}
                                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                >
                                    Yes
                                </button>

                                <button
                                    onClick={() => setShowOverlay(false)}
                                    className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                                >
                                    No
                                </button>

                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-600">
                                Success
                            </h2>

                            <p className="text-gray-700 mt-3">
                                {message}
                            </p>
                        </>
                    )}

                </div>
            </div>
        )}
    </div>
    
  )
}

export default StudentSidebarTab
