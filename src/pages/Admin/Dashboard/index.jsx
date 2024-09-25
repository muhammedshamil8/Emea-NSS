import React from 'react';

function Card({ title, count, icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
      <div className="p-3 rounded-full bg-blue-100">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-600 text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold">{count}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Volunteers" 
          count={120} 
          icon={<i className="fas fa-users text-blue-600 text-2xl"></i>} 
        />
        <Card 
          title="Events" 
          count={35} 
          icon={<i className="fas fa-calendar-alt text-green-600 text-2xl"></i>} 
        />
        <Card 
          title="Reports" 
          count={75} 
          icon={<i className="fas fa-file-alt text-yellow-600 text-2xl"></i>} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
