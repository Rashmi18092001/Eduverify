import React, { useState } from 'react'
import Logo from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom'
import { QrCode } from 'lucide-react';
import { FileSearchCorner } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { MoveRight } from 'lucide-react';
import { useEffect } from 'react';

const Verify = () => {

    const [certId, setCertId] = useState('')
    const navigate = useNavigate();
    const [QR, setQR] = useState(null)

    const handleSave = async() => {
        try {
            const response = await fetch(`http://192.168.100.103:3000/v1/verify/verify_certificate?certificate_id=${certId}`, {
                credentials: 'include',
                method: 'GET'
            })

            const data = await response.json();
            console.log('data', data);
            
            if(data.status){
                // navigate('/verify_certificate', {
                //     state: {
                //         status: data.data
                //     }
                // })
                navigate(`/verify_certificate/${certId}`);
            } else{
                alert(data.message)
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        const fetchQR = async()=>{
            try {
                const response = await fetch(`http://localhost:3000/v1/verify/fetch_QR?certificate_id=${certId}`, {
                    method: 'GET'
                })
                const data = await response.json();
                console.log('data of qr =---', data);
                
                if(data.status){
                    setQR(data.qr_url)
                } 
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchQR()
    }, [certId])

  return (
    <div className='pb-10 md:px-10 px-5'>
      <div className='flex justify-between'>
        <div>
            <Logo/>
        </div>
        <div className='py-10'>
            <Link className='font-semibold text-gray-700 hover:underline' to='/'>Home</Link>
        </div>
      </div>

      <div className='text-center mb-10'>
        <p className='text-xl md:text-3xl font-bold text-gray-700'>Verify Certificate</p>
        <p className='text-base md:text-xl font-semibold text-gray-600'>Enter Certificate id or scan QR code to verify</p>
      </div>

      <div className='flex justify-around items-center flex-col md:flex-row gap-10'>
        <div className='w-full md:w-1/2'>
            <div className='flex justify-between mb-2'>
                <p className='border-blue-500 text-base font-medium '>Enter certificate id</p>
                <p className='border-blue-500 text-base font-medium '>Scan QR code</p>
            </div>
            
            <div className='border-2 border-gray-400 p-5 md:p-10 w-full rounded '>
                <p className='text-[1.1rem] font-medium text-gray-800'>Enter Certificate</p>
                <div className='flex justify-between'>
                    <input value={certId} onChange={(e)=>{setCertId(e.target.value)}} className='border-2 rounded border-gray-500 p-2 w-full' type="text" placeholder='Enter certificate ID'/>
                    <button onClick={handleSave} className='bg-blue-500 text-white font-semibold px-3 py-2 border-blue-500 rounded mx-4 active:scale-95 hover:bg-blue-600'>Verify</button>
                </div>
                
            </div>
        </div>
        <div className='w-60 h-30 md:w-57 md:h-50'>
            {
                QR && (
                    <>
                        <div className='border-2 border-gray-600 p-3 rounded-2xl'>
                            <img className='w-full h-full' src={QR} alt="" />
                        </div>
                        <p className='text-center mt-1 text-lg font-semibold text-blue-600'>Scan QR code</p>

                    </>
                )
            }
            
        </div>
      </div>

      <div className='w-full max-w-7xl mx-auto bg-blue-50 rounded-2xl flex justify-between mt-50 md:mt-25 md:mx-25 px-5 md:px-15 py-10'>
        <div className='flex justify-center items-center flex-col'>
            <div>
                <QrCode className='w-6 h-6 md:w-10 md:h-10' size={40} color='#0d65d9'/>
            </div>
            <div>
                <p className='text-sm md:text-base font-semibold text-gray-700 text-center'>1. Enter ID or scan QR code</p>
            </div>
        </div>
        <div>
            <MoveRight className="w-10 h-10 md:w-20 md:h-20 text-gray-400" size={90} color="#828282" strokeWidth={1} />
        </div>
        <div className='flex justify-center items-center flex-col'>
            <div>
                <FileSearchCorner className='w-6 h-6 md:w-10 md:h-10' size={40} color='#0d65d9'/>
            </div>
            <div>
                <p className='text-sm md:text-base font-semibold text-gray-700 text-center'>2. System fetches the certificate</p>
            </div>
        </div>
        <div>
            <MoveRight className="w-10 h-10 md:w-20 md:h-20 text-gray-400" size={90} color="#828282" strokeWidth={1} />
        </div>
        <div className='flex justify-center items-center flex-col'>
            <div>
                <FileCheck className='w-6 h-6 md:w-10 md:h-10' size={40} color='#0d65d9'/>
            </div>
            <div>
                <p className='text-sm md:text-base font-semibold text-gray-700 text-center'>3. View Certificate</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Verify
