import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import CreateGroup from "./createGroup";
import GroupChat from "./groupChat";
import { FcSettings } from "react-icons/fc";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";



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
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleShowNavbar = () =>{
    setShowNavbar(!showNavbar)
  }


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

  return (
    <div className="chat-main-container">

<div className="side-navbar" style={{
  backgroundColor:'whitesmoke', 
  height:'100%',
  width:'5%', 
  display:'flex',
  flexDirection:'column', 
  alignItems:'center'
    }}>
      
      <Link
      style={{
        display: 'flex',
        flex:'column',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: 'inherit',
        justifyContent:'center'

      }}
      >
      <IoChatboxEllipsesOutline style={{marginTop:'0.2rem', }} />
      </Link>
      <p>All chats</p>

      <Link
            style={{
              display: 'flex',
              flex:'column',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'inherit',
              justifyContent:'center'
      
            }}
      >
      
      <IoSearchOutline style={{marginTop:'0.2rem'}}/>
      </Link>
      <p>Search</p>
   
      <Link
    to="/settings/user"
    style={{
      display: 'flex',
      flex:'column',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
      color: 'inherit',
      justifyContent:'center'
    }}
  >
    <IoSettingsOutline style={{marginTop:'0.2rem'}}/>

  </Link>
  <p>Settings</p>
    </div>





     <div className="listed-groups-container">
     {/*<h2>Welcome, {user?.email}</h2> */}


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
          {chatRooms.map((room) => {
            const isSelected = selectedRoom?.roomId === room._id;

              return (
                   <li
                    key={room._id}
                   className={`group-name-container ${isSelected ? 'selected' : ''}`}
                   onClick={() => setSelectedRoom({ roomId: room._id, name: room.name })} >
                     {room.name}
                    </li>
                        );
                    })}
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




