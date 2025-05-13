import { JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import CreateGroup from "./createGroup";

interface ChatRoom {
  _id: string;
  name: string;
  isPrivate: boolean;
}

const ListOfChats = (): JSX.Element => {

  const [email, setEmail] = useState('');

  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  // Load user email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
    }
  }, []);

  // Load chatrooms from server
  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:3001/chatrooms');
      const data = await res.json();
      setChatRooms(data);
    } catch (error) {
      console.error("Failed to fetch chat rooms", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleJoin = (roomId: string) => {
    navigate(`/group/${roomId}`);
  };

  return (
    <>
      <h1>Welcome, {user?.email}</h1>

      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>

      <br /><br />

      <button onClick={() => setShowCreateGroup(!showCreateGroup)}>
        {showCreateGroup ? 'Cancel' : 'Create Group'}
      </button>

      {showCreateGroup && (
        <CreateGroup onGroupCreated={fetchRooms} />
      )}

      

      <h2>Available Public Groups</h2>
      <ul>
        {chatRooms.map((room) => (
          <li key={room._id}>
            {room.name}
            <button onClick={() => handleJoin(room._id)} style={{ marginLeft: '1rem' }}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ListOfChats;

