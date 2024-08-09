import React, { useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [email, setEmail] = useState('');

  const addAllowedUser = async () => {
    try {
      await axios.post('http://localhost:5000/add_allowed_user', { email });
      alert('User added successfully');
    } catch (error) {
      alert('Error adding user');
    }
  };

  const removeAllowedUser = async () => {
    try {
      await axios.post('http://localhost:5000/remove_allowed_user', { email });
      alert('User removed successfully');
    } catch (error) {
      alert('Error removing user');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
      />
      <button onClick={addAllowedUser}>Add Allowed User</button>
      <button onClick={removeAllowedUser}>Remove Allowed User</button>
    </div>
  );
}

export default AdminPanel;