import React, {JSX, useEffect, useState} from 'react'
import socket from '/Users/turnbull_f/Desktop/react-apps/chat-app/backend/src/socket.ts'
import { useAuth } from '../useAuth';


const GroupChat = ({roomId, email}:{roomId: string, email:string}): JSX.Element =>{

    const { user } = useAuth();
    const [message, setMessage] = useState<string[]>([]);
    const [input, setInput] = useState('');
  
    useEffect(() => {
      if (!user) return;
      socket.emit('join-group', { roomId, username: user.email});
  
      socket.on('system-message', (msg) => {
        setMessage((prev) => [...prev, `📢 ${msg}`]);
      });
  
      socket.on('receive-message', (msg) => {
        setMessage((prev) => [...prev, `${msg.sender}: ${msg.content}`]);
      });
  
      return () => {
        socket.off('system-message');
        socket.off('receive-message');
      };
    }, [roomId, user]);
  
    const sendMessage = () => {
      if (!user || !input) return;
      socket.emit('send-message', {
        sender: user._id,
        content: input,
        roomId,
      });
      setInput('');
    };

    return(
        <div>
        <ul>
          {message.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    )

}

