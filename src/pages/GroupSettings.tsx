import React, { JSX, useState } from "react";
import { useLocation } from "react-router-dom";


const GroupSettings: React.FC = () =>{
    const location = useLocation();
    const [groupName, setGroupName] = useState<string>(location.state?.name);
    const [groupDescription, setGroupDescription]= useState<string>('');
    const [isSubmitting, setIsSubmitting]= useState<boolean>(false);
    const [showNameInput, setShowNameInput] = useState<boolean>(false)


    const handleEditName = async(e:React.FormEvent<HTMLFormElement>):Promise<void> =>{

    }
    

    const handleGroupChanges = async(e:React.FormEvent<HTMLFormElement>):Promise<void> =>{
        e.preventDefault();

    }
    
    return(
        <div className="group-settings-container">

            <form onSubmit={(e)=>{
                e.preventDefault();
                handleGroupChanges(e);

            }}>
            <h1>Group settings: {groupName}</h1> 
            <p>Edit Group name</p> 
            <button type='button' onClick={()=>setShowNameInput(!showNameInput)}>{showNameInput ? "Cancel" : "Edit group name"}
            </button>         
            {showNameInput && (
                <input type="text" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>   
            )}
                 </form>
            <p>Remove members</p> <button>Edit</button>
            <p>Make someone else an admin</p> <button></button>

        </div>
    )
}

export default GroupSettings;