import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AuthLayout from './components/Layouts/AuthLayout';
import SigninPage from './components/Pages/SigninPage';
import SignupPage from './components/Pages/SignupPage';
import RootLayout from './components/Layouts/RootLayout';
import Dashboard from './components/Pages/Dashboard';


const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={ <SigninPage />} /> 
          <Route path='/sign-up' element={ <SignupPage />} /> 
        </Route>

        <Route element={ <RootLayout />}>
          <Route index element = {<Dashboard />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App