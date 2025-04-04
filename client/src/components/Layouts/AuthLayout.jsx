import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
    const isAuthenticaed = false;
    
  return (
    <>
     {isAuthenticaed ? (
        <Navigate to={"/"} />   
     ) : (
        <>
            <section className='flex flex-1 min-h-screen justify-center items-center flex-col py-10 bg-gray-300'>
                <Outlet />
            </section>
        </>
     )}
    </>
  )
}

export default AuthLayout