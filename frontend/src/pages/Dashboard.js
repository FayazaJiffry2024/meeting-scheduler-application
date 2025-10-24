import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/meetings');
      const meetings = response.data.meetings || [];
      
      // Filter upcoming meetings
      const now = new Date();
      const upcoming = meetings.filter(m => new Date(m.start_time) > now)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 5);
      
      setUpcomingMeetings(upcoming);
      
      // Check if calendar is connected (simplified check)
      setIsCalendarConnected(meetings.some(m => m.google_event_id));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      const response = await api.get('/google/auth');
      window.location.href = response.data.auth_url;
    } catch (error) {
      toast.error('Failed to initiate Google Calendar connection');
    }
  };

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <Link to="/meetings/new" className="btn btn-primary">
          Create New Meeting
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Google Calendar</h3>
          {isCalendarConnected ? (
            <div className="status-connected">
              <span className="status-icon">✓</span>
              <span>Connected</span>
            </div>
          ) : (
            <div>
              <p>Connect your Google Calendar to sync meetings automatically</p>
              <button onClick={handleConnectCalendar} className="btn btn-secondary">
                Connect Google Calendar
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Quick Stats</h3>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-value">{upcomingMeetings.length}</div>
              <div className="stat-label">Upcoming Meetings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Upcoming Meetings</h3>
        {upcomingMeetings.length === 0 ? (
          <p>No upcoming meetings scheduled</p>
        ) : (
          <div className="meetings-list">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="meeting-item">
                <div className="meeting-info">
                  <h4>{meeting.title}</h4>
                  <p className="meeting-time">
                    {new Date(meeting.start_time).toLocaleString()}
                  </p>
                </div>
                {meeting.google_event_id && (
                  <span className="sync-badge">Synced</span>
                )}
              </div>
            ))}
          </div>
        )}
        <Link to="/meetings" className="view-all-link">
          View All Meetings →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
