import React, { JSX, useState } from "react";
import { useAuth } from "../useAuth";
import { response } from "express";
import { toast } from "react-toastify";


const Settings: React.FC  = ()=>{
    const {user} = useAuth();
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(user?.firstName);
    const [lastName, setLastName] = useState<string>(user?.lastName);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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
        <div className="settings-pag-container">
            <form 
            onSubmit={(e)=>{
                e.preventDefault();
                handleSaveChanges(e);
            }}
            >
            <p>Edit Profile: {firstName} {lastName}</p>
            <button onClick={()=> setShowNameInput(!showNameInput)}>
            { showNameInput ? "Cancel": "Edit name" }
            </button>
        {  showNameInput &&(
                <div className="edit-name-">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)}></input>

                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value) }></input>
                    <button type="submit" disabled={isSubmitting}>Save Changes</button>
                </div>
            )
        }
        </form>
        </div>
    )

}

export default Settings;