// src/components/MessageInput.js
import React, { useState } from 'react';

const MessageInput = ({ socket }) => {
  const [message, setMessage] = useState('');

  const handleTyping = () => {
    socket.emit('typing', { senderId: 1 });
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { senderId: 1, content: message });
      setMessage('');
    }
  };

  return (
    <div className="p-4 border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleTyping}
        className="border p-2 w-full"
        placeholder="Type a message"
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
