import /*React,*/ {JSX, useEffect, useState} from 'react'
import socket from '/Users/turnbull_f/Desktop/react-apps/chat-app/backend/src/socket.ts'
import { useAuth } from '../useAuth';
import { FcSettings } from "react-icons/fc";
import { Link } from 'react-router-dom';
// chalenge: set up voice chat rooms

const GroupChat = ({roomId, name}:{roomId: string, name:string}): JSX.Element => {

  type Message = {
    _id: string;
    sender: {
      _id: string;
      email: string;
    };
    content: string;
    createdAt: string;
  };

  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // 🟡 Load chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3001/messages/${roomId}`);
        const data = await res.json();
        setMessages(data);
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
      const systemMessage: Message = {
        _id: `system-${Date.now()}`,
        sender: { _id: 'system', email: 'System' },
        content: `📢 ${msg}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
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
      senderName: user.email,
      content: input,
      roomId,
    });
    setInput('');
  };

  return (
    <div className='group-chat-container'>
      <h2>{name}</h2>
      <Link
    to={`/settings/group/${roomId}`}
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
      
  <ul style={{ listStyleType: 'none', padding: 0 }}>
  {messages.map((msg) => {
    const isOwnMessage = msg.sender._id === user._id;
    const time = new Date(msg.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <li
        key={msg._id}
        style={{
          textAlign: isOwnMessage ? 'right' : 'left',
          margin: '8px 0',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: isOwnMessage ? '#dcf8c6' : '#f1f0f0',
            padding: '10px 14px',
            borderRadius: '16px',
            maxWidth: '70%',
          }}
        >
          {!isOwnMessage && (
            <div style={{ fontSize: '0.8em', fontWeight: 'bold' }}>
              {msg.sender.email}
            </div>
          )}
          <div>{msg.content}</div>
          <div style={{ fontSize: '0.75em', color: '#666', marginTop: '4px' }}>
            {time}
          </div>
        </div>
      </li>
    );
  })}
</ul>

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default GroupChat;
