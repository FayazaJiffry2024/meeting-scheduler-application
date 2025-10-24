import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './MeetingList.css';

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data.meetings || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    try {
      await api.delete(`/meetings/${id}`);
      toast.success('Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  const handleSync = async (id) => {
    try {
      await api.post(`/meetings/${id}/sync`);
      toast.success('Meeting synced to Google Calendar');
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to sync meeting');
    }
  };

  if (loading) {
    return <div className="meeting-list">Loading...</div>;
  }

  return (
    <div className="meeting-list">
      <div className="meeting-list-header">
        <h2>My Meetings</h2>
        <Link to="/meetings/new" className="btn btn-primary">
          Create New Meeting
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="empty-state">
          <p>No meetings scheduled yet</p>
          <Link to="/meetings/new" className="btn btn-secondary">
            Create Your First Meeting
          </Link>
        </div>
      ) : (
        <div className="meetings-grid">
          {meetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <div className="meeting-card-header">
                <h3>{meeting.title}</h3>
                {meeting.google_event_id && (
                  <span className="sync-badge">Synced</span>
                )}
              </div>
              
              <p className="meeting-description">{meeting.description}</p>
              
              <div className="meeting-details">
                <div className="detail-item">
                  <strong>Start:</strong> {new Date(meeting.start_time).toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>End:</strong> {new Date(meeting.end_time).toLocaleString()}
                </div>
                {meeting.attendees && meeting.attendees.length > 0 && (
                  <div className="detail-item">
                    <strong>Attendees:</strong> {meeting.attendees.join(', ')}
                  </div>
                )}
              </div>

              <div className="meeting-actions">
                {!meeting.google_event_id && (
                  <button 
                    onClick={() => handleSync(meeting.id)} 
                    className="btn btn-small btn-secondary"
                  >
                    Sync to Calendar
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(meeting.id)} 
                  className="btn btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingList;
