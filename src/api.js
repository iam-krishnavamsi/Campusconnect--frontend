import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

export const login = (name, collegeCode) => API.post('/auth/login', { name, collegeCode }).then(r => r.data);
export const getChannels = (collegeId) => API.get(`/colleges/${collegeId}/channels`).then(r => r.data);
export const getMessages = (channelId) => API.get(`/channels/${channelId}/messages`).then(r => r.data);
export const createChannel = (payload) => API.post('/channels', payload).then(r => r.data);
