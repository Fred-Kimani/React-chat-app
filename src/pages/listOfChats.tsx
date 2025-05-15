import { JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import CreateGroup from "./createGroup";
import GroupChat from "./groupChat";

interface ChatRoom {
  _id: string;
  name: string;
  isPrivate: boolean;
}

const ListOfChats = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ roomId: string; name: string } | null>(null);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
    }
  }, []);

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

  return (
    <div className="chat-main-container">

     <div className="listed-groups-container">
     <h2>Welcome, {user?.email}</h2>
     <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>

      <br /><br />

      <h3>Available Groups</h3>

      <button onClick={() => setShowCreateGroup(!showCreateGroup)}>
        {showCreateGroup ? 'Cancel' : 'Create Group'}
      </button>

      {showCreateGroup && <CreateGroup onGroupCreated={fetchRooms} setSelectedRoom={setSelectedRoom} />}

      <ul className="list-of-groups">
        {chatRooms.map((room) => (
          <li key={room._id}>
            {room.name}
            <button onClick={() => setSelectedRoom({roomId:room._id, name:room.name})} style={{ marginLeft: '1rem' }}>
              Chat
            </button>
          </li>
        ))}
      </ul>
      </div>
      <hr />

      <div className="chatroom-container">

      {selectedRoom ? (
        <GroupChat roomId={selectedRoom.roomId} name={selectedRoom.name} />
      ) : (
        <p>Select a group to start chatting.</p>
      )}
      </div>

      
    </div>
  );
};

export default ListOfChats;




