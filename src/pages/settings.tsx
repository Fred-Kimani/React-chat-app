import React, { useState } from "react";
import { useAuth } from "../useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from './BackButton';

import '../index.css'




const Settings: React.FC  = ()=>{
    const {user,logout} = useAuth();
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(user?.firstName);
    const [lastName, setLastName] = useState<string>(user?.lastName);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const navigate = useNavigate()

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
          logout();            // your logout function
          navigate('/login');  // redirect to login page
        }
      };
      

    const handleSaveChanges = async(e:React.FormEvent<HTMLFormElement>): Promise<void> =>{
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:3001/settings/edit-user', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json"   
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    userId:user._id
                })
            });
            const data = await res.json();

            if(res.ok){
                toast.success(data.message, {
                    position:'top-right'
                })
                setShowNameInput(!showNameInput)
            }
            else {
                    // Handle errors (e.g., display error messages)
                    console.error('Registration failed:', data.error || data.message);
                    toast.error(data.error || data.message, {
                      position: "top-right",  // Corrected position string
                    });
                  }

        } catch (error) {
            console.log(error)
            
        }
        finally{
            setIsSubmitting(false)
        }

    }

    return(

        <div className="settings-page-container">

            <div className="settings-box">
             <div className="back-button-container">
               <BackButton />
             </div>

             <h1>Settings Page</h1>
            
            <form 
            onSubmit={(e)=>{
                e.preventDefault();
                handleSaveChanges(e);
            }}
            >
            <p>Edit Profile: {firstName} {lastName}</p>
            <button type="button" onClick={()=> setShowNameInput(!showNameInput)} className="cancel-edit-button">
            { showNameInput ? "Cancel": "Edit name" }
            </button>
        {  showNameInput &&(
                <div className="edit-name-button">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)}></input>

                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value) }></input>
                    <button type="submit" disabled={isSubmitting} className="save-name-button">Save Changes</button>
                </div>
            )
        }
        </form>

        <button onClick={handleLogout} className="logout-button">
                   Logout
                 </button>
        </div>
        </div>
    )

}

export default Settings;