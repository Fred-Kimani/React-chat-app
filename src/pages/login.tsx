import { JSX } from "react";



const LoginPage = ():JSX.Element =>{
    return(

        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>


                <label >Your E-mail</label>
                <input type="text" placeholder="Email"/>

                <label >Password</label>
                <input type="text" placeholder="Password" />
                <button>Login</button>
                <a href="">Forgot password ? Steps to reset</a>
            </div>
        </div>
    )
}

export default LoginPage