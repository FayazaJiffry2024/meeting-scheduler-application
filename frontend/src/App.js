import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import MeetingList from './pages/MeetingList';
import CreateMeeting from './pages/CreateMeeting';
import CalendarView from './pages/CalendarView';
import GoogleCalendarConnect from './pages/GoogleCalendarConnect';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meetings" element={<MeetingList />} />
            <Route path="/meetings/new" element={<CreateMeeting />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/calendar/connected" element={<GoogleCalendarConnect />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
