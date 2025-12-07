import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { getMessages } from '../api';

const socket = io(process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000');

export default function ChatWindow({ user }) {
  const [channelId, setChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(()=> {
    // for MVP, join the first channel by fetching channels from API quickly (or select announcements)
    // We'll set channel via localStorage if present, else wait for user to pick.
    // For now: no channel; instruct user in UI.
  }, []);

  useEffect(()=> {
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('newMessage');
  }, []);

  const joinChannel = async (chId) => {
    setChannelId(chId);
    socket.emit('joinChannel', { channelId: chId, userId: user.id });
    const msgs = await getMessages(chId);
    setMessages(msgs);
    setTimeout(()=> bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const send = () => {
    if (!text || !channelId) return;
    socket.emit('sendMessage', { channelId, userId: user.id, text });
    setText('');
  };

  return (
    <div className="chat">
      {!channelId ? (
        <div style={{padding:20}}>
          <h3>Welcome {user.name}</h3>
          <p>To start: open the sidebar, pick a channel (or create one). For quick demo use channel id <b>paste</b> into the field below</p>
          <input placeholder="Paste channel id to join" onKeyDown={async (e)=>{ if(e.key==='Enter'){ await joinChannel(e.target.value); }}} />
        </div>
      ) : (
        <>
          <div className="messages">
            {messages.map(m => <div key={m._id} className="msg"><b>{m.sender?.name || 'Unknown'}:</b> {m.text}</div>)}
            <div ref={bottomRef} />
          </div>
          <div className="composer">
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} placeholder="Type a message..." />
            <button onClick={send}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}
