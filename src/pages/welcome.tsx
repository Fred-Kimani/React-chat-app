import React, { JSX, useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";






const WelcomePage = () : JSX.Element =>{
    const navigate = useNavigate();

    const handleLoginClick = ():void =>{
        navigate('/register');
    }

    const[isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(()=>{

    }, [])

    return(
      
        <div className="Welcome-Page-Container">
            <nav className="top-navbar">
            <ul className="nav justify-content-center">
               <li className="nav-item">
                   <a className="nav-link active" aria-current="page" href="#">Home</a>
               </li>
               <li className="nav-item">
                  <a className="nav-link" href="#">About</a>
               </li>
               <li className="nav-item">
                 <a className="nav-link" href="#">Contact</a>
               </li>
            </ul>
            </nav>


            <h1>Welcome to the KimCore Chat, Where you can chat with your friends in Real Time </h1>
            <Typewriter 
            words={['Stay connected.', 'I miss you mum 😢', 'When will I see you again? 🥲', 'Did you eat my pizza from the fridge? 😡']}
            loop={true}
            />
            <button onClick={handleLoginClick}>Get Started</button>

        </div>
      
    )

}

export default WelcomePage;