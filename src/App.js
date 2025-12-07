import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [user, setUser] = useState(null);
  const [collegeId, setCollegeId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('cc_user');
    if (stored) {
      const obj = JSON.parse(stored);
      setUser(obj.user);
      // user isn't storing collegeId; backend returns college name only - for channels we need id, but for MVP we'll read from token later
      setCollegeId(obj.collegeId || null);
    }
  }, []);

  if (!user) return <Login onLogin={(payload) => {
    localStorage.setItem('cc_user', JSON.stringify(payload));
    setUser(payload.user);
    setCollegeId(payload.collegeId);
  }} />;

  return (
    <div className="app">
      <Sidebar user={user} collegeId={collegeId} />
      <ChatWindow user={user} />
    </div>
  );
}
