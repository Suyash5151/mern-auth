import React from 'react'
import { useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion";
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';



const EmailVerification = () => {
  const [code,setCode]=useState(["","","","","",""]);
  const inputRefs= useRef([]);
  const navigate = useNavigate();



	const { error, isLoading, verifyEmail } = useAuthStore();


  const handleOTP= async (e)=>{
    e.preventDefault();
    const verificationCode=code.join("");
    try{
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email Verified Successfully");
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    if(code.every((digit)=>digit !=="")){
      handleOTP(new Event("submit"))
    }
  },[code]);


const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};


  const handleKeyDown=(index,e)=>{
    if(e.key==="Backspace" && !code[index] && index>0){
      inputRefs.current[index-1].focus();

    }


  };
   

  return (
  <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-8">
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text '>Verify Your Email</h2>
      <p className='text-center text-gray-300 mb-6'>Enter the 6 digit code sent to your email id</p>

      <form className='space-y-6 p-4' onSubmit={handleOTP}>
        <div className='flex justify-between'>
          {code.map((digit,index) => (
            <input
            key={index}
            ref={(el)=>(inputRefs.current[index]=el)}
            type='text'
            maxLength='6'
            value={digit}
            onChange={(e)=>handleChange(index,e.target.value)}
            onKeyDown={(e)=>handleKeyDown(index,e)}
            className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none '
            />


          ))}
        </div>
        {error && <p className='text-red-500 font-bold mt-2'>{error}</p>}
        <motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</motion.button>

      </form>
    </motion.div>

  </div>
    
  )
}

export default EmailVerification