import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";


const RegisterPage = (): JSX.Element =>{

    const navigate = useNavigate();

    const navigateToLogin = (): void =>{
        navigate('/login')
    }

    return(
        <div className="registration-page">

        <div className="registration-page-container">
            <h1>Register</h1>

            

            <label>Enter your first name</label>
            <input type="text" placeholder="Your first name" required/>

            <label>Enter your last name</label>
            <input type="text" placeholder="Your last name" required/>

            <label>Enter your email</label>
            <input type="text" placeholder="Email" required/>

            <label>Password</label>
            <input type= "text" placeholder="Password" required/>

            <label>Confirm password</label>
            <input type= "text" placeholder="Confirm password" required />



            <button onClick={navigateToLogin}>Register</button>

            <a className = "login-link" href="/login">Already have an account? Login</a>



        </div>
        </div>
    )
}




export default RegisterPage;