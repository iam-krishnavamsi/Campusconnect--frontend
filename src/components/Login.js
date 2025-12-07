import React, { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('TESTCOL'); // default test seed code
  const [err, setErr] = useState('');

  const doLogin = async () => {
    try {
      const data = await login(name, code);
      // token + user returned
      onLogin({ token: data.token, user: data.user, collegeId: data.user.collegeId });
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login">
      <h2>CampusConnect — Login</h2>
      <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="College code (e.g. TESTCOL)" value={code} onChange={e=>setCode(e.target.value)} />
      <button onClick={doLogin}>Join</button>
      <div style={{color:'red'}}>{err}</div>
      <p>Use <b>TESTCOL</b> if you ran the seed script.</p>
    </div>
  );
}
