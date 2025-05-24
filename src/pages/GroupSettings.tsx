import React, { JSX, useState } from "react";


const GroupSettings: React.FC = () =>{

    const [groupName, setGroupName] = useState<string>('')
    const [groupDescription, setGroupDescription]= useState<string>('')
    const [isSubmitting, setIsSubmitting]= useState<boolean>(false)

    const handleGroupChanges = async(e:React.FormEvent<HTMLFormElement>):Promise<void> =>{
        e.preventDefault();

        

        


    }
    
    return(
        <div className="group-settings-container">

            <form onSubmit={(e)=>{
                e.preventDefault();
                handleGroupChanges(e);

            }}>

            </form>
            <h2>Group settings</h2>
            <p>Edit Group name</p>
            <p>Remove members</p>
            <p>Make someone else an admin</p>

        </div>
    )
}

export default GroupSettings;