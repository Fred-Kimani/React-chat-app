import { JSX } from "react";
import { useNavigate } from "react-router-dom";



const LoginPage = ():JSX.Element =>{

    const navigate = useNavigate();

    const navigateBackToRegister = (): void =>{
        navigate('/register')
    }
    return(

        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>


                <label >Your E-mail</label>
                <input type="text" placeholder="Email" name="email"/>

                <label >Password</label>
                <input type="text" placeholder="Password" name="password" />
                <button >Login</button>
                <a onClick={navigateBackToRegister}>Don't have an account yet? Back to registration</a>
                <a href="">Forgot password ? Steps to reset</a>
            </div>
        </div>
    )
}

export default LoginPage