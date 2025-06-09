import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import CreateGroup from "./createGroup";
import GroupChat from "./groupChat";
import { FcSettings } from "react-icons/fc";


interface ChatRoom {
  _id: string;
  name: string;
  isPrivate: boolean;
}

interface User{
  _id: string,
  email: string
}


const ListOfChats: React.FC= () => {
  const [email, setEmail] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ roomId: string; name: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 4) {
        fetch(`http://localhost:3001/users/search?email=${searchTerm}&requesterId=${user._id}`)
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch((err) => console.error(err));
      } else {
        setSearchResults([]);
      }
    }, 300); // debounce by 300ms
  
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  const handleUserClick = async (selectedUser: { _id: string; email: string }) => {
    if (!user) {
      console.log('User is undefined or null!');
      return;
    }
    console.log('User is defined:', user);
    const loggedInUserId = user._id;
    const otherUserId = selectedUser._id;
    console.log('The 2 users are current: ',loggedInUserId, 'The other user: ',otherUserId);

    //For the group name
    const participants = [user.email, selectedUser.email].sort();
    const roomName = `${participants[0]}--${participants[1]}`;
  
    try {
      console.log('loggedInUserId:', loggedInUserId, 'otherUserId:', otherUserId);
      const res = await fetch("http://localhost:3001/chatrooms/create-private", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName, 
          isPrivate: true,
          isOpen: false,
          userId1: loggedInUserId,
          userId2: otherUserId,
        }),
      });
  
      const data = await res.json();
      console.log(data)
      setSelectedRoom({ roomId: data._id, name: roomName });
    } catch (err) {
      console.error("Private chat creation failed", err);
    }
  };
  
  

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
    }
  }, []);

  const fetchRooms = async ():Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3001/chatrooms?userId=${user._id}`);
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
     <Link
    to="/settings/user"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      color: 'inherit',
    }}
  >
    <FcSettings />
    <span>Settings</span>
  </Link>
     <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>

      <br /><br />

      <div>
      <input
        type="text"
        placeholder="Search users by email..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowOverlay(e.target.value.length >= 4);
        }}
      />

{showOverlay && (
  <div className="search-overlay" onClick={() => setShowOverlay(false)}>
    <ul>
      {searchResults.length > 0 ? (
        searchResults.map(user => (
          <li
            key={user._id}
            onClick={(e) => {
              e.stopPropagation(); // prevent overlay from closing before click
              console.log('I have been clicked:', user);
              handleUserClick(user);
              
            }}
          >
            {user.email}
          </li>
        ))
      ) : (
        <li>No users found</li>
      )}
    </ul>
  </div>
)}

    </div>

      <h3>Available Groups</h3>

      <button onClick={() => setShowCreateGroup(!showCreateGroup)}>
        {showCreateGroup ? 'Cancel' : 'Create Group'}
      </button>

      {showCreateGroup && <CreateGroup onGroupCreated={fetchRooms} setSelectedRoom={setSelectedRoom} />}

      <ul className="list-of-groups">
        {chatRooms.map((room) => (
          <li key={room._id} className="group-name-container" onClick={() => setSelectedRoom({roomId:room._id, name:room.name})}>
            {room.name}
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




