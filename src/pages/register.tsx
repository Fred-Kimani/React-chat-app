import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";


const RegisterPage = (): JSX.Element =>{

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
    // You can handle the registration logic here (API call)
    // Assuming registration is successful, navigate to the login page
    navigate('/login');
  };

    const navigateToLogin = (): void =>{
        navigate('/login')
    }

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



            <button type="submit">Register</button>

            <a className = "login-link" href="/login">Already have an account? Login</a>



        </form>
        </div>
    )
}




export default RegisterPage;