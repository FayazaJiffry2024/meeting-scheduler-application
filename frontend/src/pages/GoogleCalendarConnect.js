import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './GoogleCalendarConnect.css';

const GoogleCalendarConnect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  useEffect(() => {
    if (success) {
      toast.success('Google Calendar connected successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else if (error) {
      toast.error(`Failed to connect: ${error}`);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [success, error, navigate]);

  return (
    <div className="google-calendar-connect">
      <div className="connect-container">
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Successfully Connected!</h2>
            <p>Your Google Calendar has been connected to Meeting Scheduler.</p>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="error-message">
            <div className="error-icon">✗</div>
            <h2>Connection Failed</h2>
            <p>{error || 'An error occurred while connecting to Google Calendar.'}</p>
            <p>Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarConnect;
