import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

function App() {
  // State for lists
  const [requests, setRequests] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // State for Donor Form
  const [donor, setDonor] = useState({
    name: '', bloodGroup: 'O+', phone: '', lng: 78.4867, lat: 17.3850
  });

  // State for Request Form
  const [requestData, setRequestData] = useState({
    patientName: '', bloodGroup: 'O+', hospital: '', contactNumber: '', urgency: 'Critical', lng: 78.4867, lat: 17.3850
  });

  // 1. Fetch initial requests on load
  useEffect(() => {
    fetchRequests();
    
    // 2. Listen for real-time alerts
    socket.on('new-emergency', (data) => {
      setAlerts((prev) => [data, ...prev]);
      fetchRequests(); // Refresh list
    });

    return () => socket.off('new-emergency');
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/requests`);
      setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/donors`, {
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        phone: donor.phone,
        location: { type: 'Point', coordinates: [parseFloat(donor.lng), parseFloat(donor.lat)] }
      });
      alert('Donor Registered Successfully!');
      setDonor({ ...donor, name: '', phone: '' });
    } catch (err) {
      alert('Error: ' + err.response.data.error);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/requests`, {
        patientName: requestData.patientName,
        bloodGroup: requestData.bloodGroup,
        hospital: requestData.hospital,
        contactNumber: requestData.contactNumber,
        urgency: requestData.urgency,
        location: { type: 'Point', coordinates: [parseFloat(requestData.lng), parseFloat(requestData.lat)] }
      });
      alert('Request Broadcasted!');
      setRequestData({ ...requestData, patientName: '', hospital: '', contactNumber: '' });
    } catch (err) {
      alert('Error: ' + err.response.data.error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🩸 RaktaSetu</h1>
        <p>Real-time Blood & Organ Matching Network</p>
      </header>

      <div className="container">
        {/* LEFT COLUMN: Forms */}
        <div className="column">
          <div className="card">
            <h2>Register as Donor</h2>
            <form onSubmit={handleDonorSubmit}>
              <input type="text" placeholder="Full Name" value={donor.name} onChange={e => setDonor({...donor, name: e.target.value})} required />
              <select value={donor.bloodGroup} onChange={e => setDonor({...donor, bloodGroup: e.target.value})}>
                {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <input type="text" placeholder="Phone Number" value={donor.phone} onChange={e => setDonor({...donor, phone: e.target.value})} required />
              <div className="coords">
                <input type="number" step="any" placeholder="Longitude" value={donor.lng} onChange={e => setDonor({...donor, lng: e.target.value})} required />
                <input type="number" step="any" placeholder="Latitude" value={donor.lat} onChange={e => setDonor({...donor, lat: e.target.value})} required />
              </div>
              <button type="submit" className="btn-green">Become a Donor</button>
            </form>
          </div>

          <div className="card">
            <h2>Create Emergency Request</h2>
            <form onSubmit={handleRequestSubmit}>
              <input type="text" placeholder="Patient Name" value={requestData.patientName} onChange={e => setRequestData({...requestData, patientName: e.target.value})} required />
              <select value={requestData.bloodGroup} onChange={e => setRequestData({...requestData, bloodGroup: e.target.value})}>
                {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <input type="text" placeholder="Hospital Name" value={requestData.hospital} onChange={e => setRequestData({...requestData, hospital: e.target.value})} required />
              <input type="text" placeholder="Contact Number" value={requestData.contactNumber} onChange={e => setRequestData({...requestData, contactNumber: e.target.value})} required />
              <select value={requestData.urgency} onChange={e => setRequestData({...requestData, urgency: e.target.value})}>
                <option value="Critical">Critical (Immediate)</option>
                <option value="Urgent">Urgent</option>
                <option value="Moderate">Moderate</option>
              </select>
              <div className="coords">
                <input type="number" step="any" placeholder="Longitude" value={requestData.lng} onChange={e => setRequestData({...requestData, lng: e.target.value})} required />
                <input type="number" step="any" placeholder="Latitude" value={requestData.lat} onChange={e => setRequestData({...requestData, lat: e.target.value})} required />
              </div>
              <button type="submit" className="btn-red">🚨 Broadcast Request</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Data */}
        <div className="column">
          <div className="card alerts-card">
            <h2>📡 Live Alerts (WebSocket)</h2>
            {alerts.length === 0 ? <p className="empty">Waiting for emergency broadcasts...</p> : null}
            {alerts.map((a, i) => (
              <div key={i} className="alert-item">
                <strong>{a.message}</strong>
                <span>Patient: {a.request.patientName}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Active Requests</h2>
            {requests.length === 0 ? <p className="empty">No active requests.</p> : null}
            <ul className="request-list">
              {requests.map(req => (
                <li key={req._id}>
                  <div className={`badge ${req.urgency}`}>{req.urgency}</div>
                  <h3>{req.bloodGroup} Blood Needed</h3>
                  <p><strong>Patient:</strong> {req.patientName}</p>
                  <p><strong>Hospital:</strong> {req.hospital}</p>
                  <p><strong>Contact:</strong> {req.contactNumber}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;