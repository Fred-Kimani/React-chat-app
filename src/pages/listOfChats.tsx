import { JSX } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";




const ListOfChats = ():JSX.Element =>{
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const { logout, user } = useAuth();

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setEmail(user.email);
        }
      }, []);

    return(
        <>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>
        </>
    )
}

export default ListOfChats;

