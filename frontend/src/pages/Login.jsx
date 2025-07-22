import React,{useState} from 'react';
import {motion} from 'framer-motion';
import {Mail,Lock,Loader} from "lucide-react";
import {Link} from "react-router-dom";
import Inputs from '../Components/Inputs';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const {login,isLoading,error} =useAuthStore();

  const   handleLogin  = async (e)=>{
    e.preventDefault();
    await login(email, password); 

  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r  from-green-400 to to-emerald-500 text-transparent  text-center bg-clip-text">
          Login to Your Account
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <Inputs
            icon={Mail}
            type='email'
            placeholder='Email Address'
            onChange={(e)=>setEmail(e.target.value)}/>
            
            <Inputs
            icon={Lock}
            type='password'
            placeholder='Password'
            onChange={(e)=>setPassword(e.target.value)}/>
            <div className='flex items-center mb-6'>
              <Link to='/forgot-password' className='text-sm text-green-400 hover:text-green-500 transition duration-200'>
                Forgot Password?
              </Link>
              </div>
              <p className='text-red-500 font-bold mb-4'>{error}</p>
              <motion.button
                className='w-full py-3 px-4 text-center  items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold  rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200' type='submit'>
                    {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login" }

                </motion.button>
            
            </form>
      </div>
      <div className='p-4 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-b-2xl text-center'>
        <p className='text-sm text-gray-300'>
          Don't have an account?
          <Link to='/signup' className='text-green-400 hover:text-green-500 transition duration-200 ml-1'>
            Sign Up 
            </Link>
            </p>
            </div>
      
    </motion.div>
    
  )
}

export default Login;