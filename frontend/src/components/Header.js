import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Meeting Scheduler</h1>
        <nav className="navigation">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/meetings" className={`nav-link ${isActive('/meetings')}`}>
            Meetings
          </Link>
          <Link to="/calendar" className={`nav-link ${isActive('/calendar')}`}>
            Calendar
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
