import /*React,*/ {JSX, useEffect, useState} from 'react'
import socket from '/Users/turnbull_f/Desktop/react-apps/chat-app/backend/src/socket.ts'
import { useAuth } from '../useAuth';
import { FcSettings } from "react-icons/fc";
import { Link } from 'react-router-dom';
import AutoGrowingTextarea from './AutoGrowingTextarea';

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

  const formatDateLabel =(date: Date | string): string => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  
    if (isSameDay(msgDate, today)) return 'Today';
    if (isSameDay(msgDate, yesterday)) return 'Yesterday';
  
    return msgDate.toLocaleDateString('de-DE'); // dd.mm.yyyy
  }
  
  

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
    <div className="chatroom-container" style={{ backgroundImage: "url('/background-chat.png')" }}>
      <div className="chatroom-header">
        <h2 style={{color:'white'}}>{name}</h2>
        <Link to={`/settings/group/${roomId}`} state={{ name }} className="chat-settings-link">
          <FcSettings style={{background:'white'}} />
          <span style={{color:'white'}}>Settings</span>
        </Link>
      </div>
  
      <ul className="chat-messages">
        {messages.reduce<JSX.Element[]>((acc, msg, index) => {
          const currentDateLabel = formatDateLabel(msg.createdAt);
          const prevDateLabel = index > 0 ? formatDateLabel(messages[index - 1].createdAt) : null;
  
          if (index === 0 || currentDateLabel !== prevDateLabel) {
            acc.push(
              <li key={`date-${msg._id}`} className="chat-date-separator">
                {currentDateLabel}
              </li>
            );
          }
  
          const isOwnMessage = msg.sender.email === user.email;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
  
          acc.push(
            <li key={msg._id} className={isOwnMessage ? 'message-right' : 'message-left'}>
              {!isOwnMessage && <div className="sender-email">{msg.sender.email}</div>}
              <div>{msg.content}</div>
              <div className="timestamp">{time}</div>
            </li>
          );
  
          return acc;
        }, [])}
      </ul>
  
      <div className="chat-input-container">
        <AutoGrowingTextarea value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
  
};

export default GroupChat;
