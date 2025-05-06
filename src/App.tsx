import React, { JSX, useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'

import WelcomePage from './pages/welcome'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'

//import listOfChats from './pages/listOfChats'
//import privateChat from './pages/privateChat'
//import groupChat from './pages/groupChat'




const App: React.FC =() => {
  

  return (
    <Routes>
      <Route path='/' element={< WelcomePage />} />
     <Route 
      path = '/register'
      element={ /*isLoggedIn ? <ListofChats /> :*/ <RegisterPage/>}
      /> 

      <Route 
      path = '/login'
      element={/* isLoggedIn ? <ListofChats /> : */ <LoginPage />}
      /> 


      {/* <Route 
      path = '/register'
      element={isLoggedIn ? <ListofChats /> : <Navigate to = "/" />}
      /> */}

      {/* <Route 
      path = '/register'
      element={isLoggedIn ? <ListofChats /> : <Navigate to = "/" />}
      /> */}

      {/* <Route 
      path = '/register'
      element={isLoggedIn ? <ListofChats /> : <Navigate to = "/" />}
      /> */}

    

    </Routes>
  )
}

export default App
