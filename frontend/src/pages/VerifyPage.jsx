import React, {useState, useEffect} from 'react'
import Logo from '../components/Logo'
import { Link, useParams } from 'react-router-dom'
import { QrCode } from 'lucide-react';
import { FileSearchCorner } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { MoveRight } from 'lucide-react';
import VerifyImage from '../images/verified.png';
import BanImage from '../images/ban.png';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer'

const Verify = () => {
    // const location = useLocation()
   
    // const status = location.state?.status
    // console.log('status', status);
    
    // const isVerified = status == 'active'
   
    const {certificate_id} = useParams();

    const [certificate, setCertificate] = useState(null)
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

//   useEffect(()=>{
//     const status =
//     certificate === "active"
//         ? "Verified"
//         : certificate === "revoked"
//         ? "Revoked"
//         : certificate === "expired"
//         ? "Expired"
//         : "Loading...";

//   }, [certificate])

const status =
    certificate === "active"
        ? "Valid"
        : certificate === "revoked"
        ? "Revoked"
        : certificate === "expired"
        ? "Expired"
        : "Loading...";
        
   useEffect(()=>{
        const verify = async ()=> {
            try {
                // const response = await fetch(`http://192.168.100.103:3000/v1/verify/verify_certificate?certificate_id=${certificate_id}`)
                const response = await fetch(`https://eduverify.onrender.com/v1/verify/verify_certificate?certificate_id=${certificate_id}`)
                const data = await response.json()
                if(data.status){
                    setCertificate(data.data)
                } 
            } catch (error) {
                console.log(error);                
            }
        }
        if(certificate_id){
            verify()
        }
    }, [certificate_id])

    const isVerified = certificate === "active";
    console.log('status', status);
    

  return (
    <div className='min-h-screen flex flex-col '>
        <div className='flex-grow md:px-10 px-5'>
            <div className='flex justify-between'>
                <div>
                    <Logo/>
                </div>
            </div>

            <div className='text-center mb-10'>
                <p className='text-xl md:text-3xl font-bold text-gray-700'>Certificate is</p>
                {/* <p className='text-base md:text-4xl font-bold text-gray-600'>Verified</p> */}
                {/* <p className={`text-base md:text-4xl font-bold ${status === "Verified" ? "text-green-600" : "text-red-600"}`}>{status}</p> */}
                {
                    status && (
                        <p
                            className={`text-3xl md:text-4xl font-bold ${
                                status === "Valid"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {status}
                        </p>
                    )
                }
                {/* <p
                    className={`text-base md:text-4xl font-bold ${
                        isVerified ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {status}
                </p> */}
                {/* <p className={`text-base md:text-4xl font-bold ${isVerified ? "text-green-600" : "text-red-600"}`}>{isVerified ? "Verified" :  "Invalid"}</p> */}
                
                <div className='flex justify-center items-center mt-10'>
                    {/* <img src={VerifyImage} alt="" className={`w-[20%] h-[20%] object-contain ${animate ? 'animate-flip' : ''}`}/> */}
                    {/* <img src={isVerified ? VerifyImage : BanImage} alt="" className={`w-[25%] h-[25%] object-contain ${animate ? 'animate-flip' : ''}`}/> */}
                    {
                        certificate && (
                            <img
                                src={isVerified ? VerifyImage : BanImage}
                                alt=""
                                className={`w-[60%] h-[60%] md:w-[25%] md:h-[25%] object-contain ${animate ? 'animate-flip' : ''}`}
                            />
                        )
                    }
                    {/* <img src="https://e7.pngegg.com/pngimages/723/887/png-clipart-computer-icons-x-mark-check-mark-red-x-miscellaneous-text-thumbnail.png" alt="" /> */}
                </div>
            </div>
         </div>  
            <Footer />

      
       
      

    </div>
  )
}

export default Verify
