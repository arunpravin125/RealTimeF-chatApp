import React, { useState } from 'react'
import useLogin from '../../hooks/useLogin'
import {Link} from "react-router-dom"
const Login = () => {
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

const {handleLogin,loading} = useLogin()

  const loginBtn = (e)=>{
    e.preventDefault()
    
    handleLogin(username,password)
  }

  return (
    <div className="flex  items-center bg-red-400 justify-center min-w-96 mx-auto bg- " >
      <div className="bg-gray-50 font-[sans-serif]">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full">

            <div className="p-10 rounded-2xl bg-white shadow">
              <h2 className="text-gray-800 text-center text-2xl font-bold">Sign in</h2>
              <form className="mt-8 space-y-4">
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">User name</label>
                  <div className="relative flex items-center">
                    <input  value={username}
              onChange={(e) => setUsername(e.target.value)} name="username" type="text"  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter user name" />

                  </div>
                </div>

                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Password</label>
                  <div className="relative flex items-center">
                    <input  value={password}
              onChange={(e) => setPassword(e.target.value)}  name="password" type="text"  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600" placeholder="Enter password" />
                  </div>
                </div>

                <div className="!mt-6">
                  <button onClick={loginBtn}  type="button" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                    {loading==true?<span className="loading loading-spinner loading-md"></span>:"Sign In"}
                  </button>
                </div>
                <p className="text-gray-800 text-sm !mt-8 text-center">Don't have an account? <Link to="/sign" className="underline hover:text-blue-300">Register here </Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login