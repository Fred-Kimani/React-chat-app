import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';



interface CreateGroupProps {
  onGroupCreated: () => void;
  setSelectedRoom: (room: { roomId: string; name: string }) => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onGroupCreated, setSelectedRoom}) => {
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();
 // const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/chatrooms/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          isPrivate: false,
          userId: user._id, // optional
        }),
      });

      const data = await res.json();
      onGroupCreated(); // refresh the group list
      setSelectedRoom({ roomId: data._id, name: groupName });
    } catch (err) {
      console.error("Group creation failed", err);
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        required
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateGroup;
