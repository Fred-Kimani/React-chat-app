import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer } from 'react-toastify';


const LoginPage = ():JSX.Element =>{

    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        email:'',
        password:''

    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;
        setFormData(prevState =>({
            ...prevState,
      [name]: value

        }))

    }

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable submit button
        try {
          // Send a POST request to the backend
          const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
          
          if (response.ok) {
            // Registration was successful, navigate to login page
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
                  // Display a success toast
                  toast.success(data.message, {
                    position: "top-right",  // Corrected position string
                  });
    
          // Redirect to login after a short delay to let the user see the success message
          setTimeout(() => {
            navigate('/mychats');
          }, 2000); // 2-second delay
            navigate('/mychats');
          } else {
            // Handle errors (e.g., display error messages)
            console.error('Login failed:', data.error || data.message);
            toast.error(data.error || data.message, {
              position: "top-right",  // Corrected position string
            });
          }
        } catch (error) {
          console.error('Error during login:', error);
          alert('There was an error during login.');
        }
        finally {
          setIsSubmitting(false); // Re-enable submit button
        }
      };

    const navigateBackToRegister = (): void =>{
        navigate('/register')
    }
    return(

        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-container">
                <h1>Login</h1>


                <label >Your E-mail</label>
                <input type="text" placeholder="Email" name="email" onChange={handleChange} value={formData.email}/>

                <label >Password</label>
                <input type="password" placeholder="Password" name="password" onChange={handleChange} value={formData.password} />
                <button type="submit" disabled={isSubmitting} >Login</button>
                <a onClick={navigateBackToRegister}>Don't have an account yet? Back to registration</a>
                <a href="">Forgot password ? Steps to reset</a>
            </form>
        </div>
    )
}

export default LoginPage