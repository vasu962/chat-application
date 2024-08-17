// src/components/ChatWindow.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Navbar from './Navbar';
import UserList from './UserList';
import MessageInput from './MessageInput';

const socket = io('http://localhost:5000');

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('typing', ({ senderId }) => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000); // Reset after 2 seconds
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/messages')
      .then((response) => response.json())
      .then((data) => setMessages(data));
  
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <UserList />
        <div className="flex-1 p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message.content}
            </div>
          ))}
          {typing && <div className="text-gray-500">User is typing...</div>}
        </div>
      </div>
      <MessageInput socket={socket} />
    </div>
  );
};

export default ChatWindow;
