import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/meetings');
      const meetings = response.data.meetings || [];
      
      const calendarEvents = meetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        start: new Date(meeting.start_time),
        end: new Date(meeting.end_time),
        resource: meeting
      }));
      
      setEvents(calendarEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    const meeting = event.resource;
    alert(`Meeting: ${meeting.title}\nTime: ${new Date(meeting.start_time).toLocaleString()}\nDescription: ${meeting.description || 'No description'}`);
  };

  if (loading) {
    return <div className="calendar-view">Loading...</div>;
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Calendar View</h2>
      </div>
      
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
        />
      </div>
    </div>
  );
};

export default CalendarView;
