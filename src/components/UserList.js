// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const UserList = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:5000');

    socket.on('updateUserStatus', ({ userId, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, online: status } : user))
      );
    });

    return () => {
      socket.off('updateUserStatus');
    };
  }, [socket]);

  return (
    <div className="w-1/4 p-4 border-r">
      {users.map((user) => (
        <div key={user.id} className="flex items-center mb-2">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              user.online ? 'bg-green-500' : 'bg-gray-500'
            }`}
          ></span>
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default UserList;
