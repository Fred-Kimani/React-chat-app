import React, { JSX, useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import WelcomePage from './pages/welcome'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'

import ListOfChats from './pages/listOfChats'
import PublicRoute from './pages/publicRoutes'
import PrivateRoute from './pages/privateRoutes'
//import privateChat from './pages/privateChat'
import GroupChat from './pages/groupChat'
import GroupChatWrapper from './pages/groupChatWrapper'
import Settings from './pages/settings'
import GroupSettings from './pages/GroupSettings'




const App: React.FC =() => {
  

  return (
    <div className='main-app-container'>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    
    <Routes>
      <Route path='/' element={< WelcomePage />} />
     <Route 
      path = '/register'
      element={   
        <PublicRoute>
        <RegisterPage />
      </PublicRoute>}
      /> 

      <Route 
      path = '/login'
      element={
        <PublicRoute>
        <LoginPage />
      </PublicRoute>
      }
      /> 


       <Route 
      path = '/mychats'
      element={
        <PrivateRoute>
        <ListOfChats />
      </PrivateRoute>
      }
      /> 

      <Route path='/group/:roomId'
      element={
        <PrivateRoute>
          <GroupChatWrapper />
        </PrivateRoute>
      }
      />

      <Route path='/settings/user'
      element = {
       <PrivateRoute>
         <Settings/>
      </PrivateRoute>
       }
      />

      <Route path='/settings/group/:id'
      element ={
       <PrivateRoute>
          <GroupSettings/>
       </PrivateRoute>
       }
     />



      

      

      {/* <Route 
      path = '/register'
      element={isLoggedIn ? <ListofChats /> : <Navigate to = "/" />}
      /> */}

      {/* <Route 
      path = '/register'
      element={isLoggedIn ? <ListofChats /> : <Navigate to = "/" />}
      /> */}

    

    </Routes>
    </div>
  )
}

export default App
