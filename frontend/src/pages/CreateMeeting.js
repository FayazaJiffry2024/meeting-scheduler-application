import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './CreateMeeting.css';

const CreateMeeting = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    attendees: '',
    sync_to_calendar: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data
    const meetingData = {
      ...formData,
      attendees: formData.attendees 
        ? formData.attendees.split(',').map(email => email.trim()).filter(Boolean)
        : []
    };

    try {
      await api.post('/meetings', meetingData);
      toast.success('Meeting created successfully!');
      navigate('/meetings');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error(error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : 'Failed to create meeting');
    }
  };

  return (
    <div className="create-meeting">
      <div className="create-meeting-container">
        <h2>Create New Meeting</h2>
        
        <form onSubmit={handleSubmit} className="meeting-form">
          <div className="form-group">
            <label htmlFor="title">Meeting Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter meeting title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter meeting description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attendees">Attendees (comma-separated emails)</label>
            <input
              type="text"
              id="attendees"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>

          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                name="sync_to_calendar"
                checked={formData.sync_to_calendar}
                onChange={handleChange}
              />
              <span>Sync to Google Calendar</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/meetings')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
