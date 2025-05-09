import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer } from 'react-toastify';

const RegisterPage = (): JSX.Element =>{

  const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });



    const navigate = useNavigate();

      // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button
    try {
      // Send a POST request to the backend
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Registration was successful, navigate to login page
        console.log('Registration successful', data);
              // Display a success toast
              toast.success(data.message, {
                position: "top-right",  // Corrected position string
              });

      // Redirect to login after a short delay to let the user see the success message
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2-second delay
        navigate('/login');
      } else {
        // Handle errors (e.g., display error messages)
        console.error('Registration failed:', data.error || data.message);
        toast.error(data.error || data.message, {
          position: "top-right",  // Corrected position string
        });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('There was an error during registration.');
    }
    finally {
      setIsSubmitting(false); // Re-enable submit button
    }
  };

    //const navigateToLogin = (): void =>{
    //    navigate('/login')
   // }

    return(
        <div className="registration-page">

        <form onSubmit={handleSubmit} className="registration-page-container">
            <h1>Register</h1>

            

            <label>Enter your first name</label>
            <input type="text" placeholder="Your first name" name="firstName" value={formData.firstName}
          onChange={handleChange} required />

            <label>Enter your last name</label>
            <input type="text" placeholder="Your last name" name="lastName" value={formData.lastName}
          onChange={handleChange} required/>

            <label>Enter your email</label>
            <input type="text" placeholder="Email" name="email" value={formData.email}
          onChange={handleChange} required/>

            <label>Password</label>
            <input type= "text" placeholder="Password" name="password" value={formData.password}
          onChange={handleChange} required/>

            <label>Confirm password</label>
            <input type= "text" placeholder="Confirm password" name="confirmPassword" value={formData.confirmPassword}
          onChange={handleChange} required />



            <button type="submit" disabled={isSubmitting}>Register</button>

            <a className = "login-link" href="/login">Already have an account? Login</a>



        </form>
        </div>
    )
}




export default RegisterPage;