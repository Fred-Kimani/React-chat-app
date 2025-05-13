import React, {JSX, useEffect, useState} from 'react'
import socket from '/Users/turnbull_f/Desktop/react-apps/chat-app/backend/src/socket.ts'
import { useAuth } from '../useAuth';

const GroupChat = ({roomId}:{roomId: string}): JSX.Element => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // 🟡 Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/messages/${roomId}`);
        const data = await res.json();

        // Map into displayable format
        const formatted = data.map((msg: any) => `${msg.sender.email}: ${msg.content}`);
        setMessages(formatted);
      } catch (err) {
        console.error('❌ Failed to load messages', err);
      }
    };

    fetchMessages();
  }, [roomId]);

  // 🟢 Setup socket events
  useEffect(() => {
    if (!user) return;

    socket.emit('join-group', { roomId, username: user.email });

    socket.on('system-message', (msg) => {
      setMessages((prev) => [...prev, `📢 ${msg}`]);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, `${msg.sender}: ${msg.content}`]);
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

  return (
    <div>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default GroupChat;
