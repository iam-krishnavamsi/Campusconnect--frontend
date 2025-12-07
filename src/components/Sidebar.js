import React, { useEffect, useState } from 'react';
import { getChannels, createChannel } from '../api';

export default function Sidebar({ user }) {
  const [channels, setChannels] = useState([]);
  const [collegeId, setCollegeId] = useState(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // TODO: get collegeId from user or token. For MVP we list channels for first college found via API
    const fetch = async () => {
      // as the API requires collegeId, attempt to fetch list of colleges then pick TESTCOL
      try {
        // naive: assume TESTCOL is known; replace with proper collegeId flow
        const colleges = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/colleges`).then(r=>r.json());
        const col = colleges.find(c=>c.code==='TESTCOL') || colleges[0];
        if (!col) return;
        setCollegeId(col._id);
        const ch = await getChannels(col._id);
        setChannels(ch);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const handleCreate = async () => {
    if (!newName || !collegeId) return;
    const ch = await createChannel({ collegeId, name: newName, createdBy: null });
    setChannels(prev => [...prev, ch]);
    setNewName('');
  };

  return (
    <div className="sidebar">
      <div className="user">Hi, {user.name}</div>
      <h4>Channels</h4>
      <div className="channels">
        {channels.map(c => <div key={c._id} className="channel">{c.name}{c.isAnnouncement ? ' 🔔' : ''}</div>)}
      </div>

      <div className="create">
        <input placeholder="new channel" value={newName} onChange={e=>setNewName(e.target.value)} />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
}
