import React, { useState } from 'react';
import { checkStatus, sendMessage } from '../utils/api';
import './StatusComponent.css';

const StatusComponent = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleCheckStatus = async () => {
    try {
      const serverStatus = await checkStatus();
      setStatus(`Server status: ${serverStatus}`);
    } catch (error) {
      setStatus(`Error checking server status: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await sendMessage(message);
      setStatus(`${response.message}`);
    } catch (error) {
      setStatus(`Error sending message: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <button className="button" onClick={handleCheckStatus}>
        Check Server Status
      </button>
      <input
        className="input"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message"
      />
      <button className="button" onClick={handleSendMessage}>
        Send Message
      </button>
      <div className="response">Status: {status}</div>
    </div>
  );
};

export default StatusComponent;
