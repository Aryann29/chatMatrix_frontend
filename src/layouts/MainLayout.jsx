// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Import the new Sidebar

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-neutral-900"> {/* Set overall background and flex container */}
      <Sidebar />
      <div className="flex-1 ml-64"> {/* Margin left to push content past the fixed sidebar */}
        <Outlet /> {/* Renders the current route's component */}
      </div>
    </div>
  );
};

export default MainLayout;