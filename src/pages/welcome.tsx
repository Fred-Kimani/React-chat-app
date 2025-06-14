import  { JSX, useEffect} from "react";
import { Typewriter } from "react-simple-typewriter";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { FaBolt, FaLock, FaUsers } from 'react-icons/fa';
import Testimonials from "./Testimonials";






const WelcomePage = () : JSX.Element =>{
    const navigate = useNavigate();

    const handleLoginClick = ():void =>{
        navigate('/login');
    }

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

            <div className="typewriter-container">
            <Typewriter 
            words={['Stay connected.', 'I miss you mum 😢', 'When will I see you again? 🥲', 'Did you eat my pizza from the fridge? 😡']}
            loop={true}
            />
            </div>

            <div className="features-section">
              <div className="feature-card">
              <FaBolt size={40} color="#007bff" />
              <h4>Real-time Messaging</h4>
              <p>Chat with no delay using powerful WebSockets.</p>
            </div>

            <div className="feature-card">
              <FaUsers size={40} color="#007bff" />
              <h4>Private & Group Chats</h4>
                 <p>Start private or public group chats anytime.</p>
            </div>

            <div className="feature-card">
              <FaLock size={40} color="#007bff" />
              <h4>Secure Conversations</h4>
              <p>Your messages are stored safely and never leaked.</p>
            </div>
        </div>
        <button onClick={handleLoginClick}>Get Started</button>

       
       <div className="testimonials">
       <Testimonials />

       </div>

            

        </div>
      
    )

}

export default WelcomePage;