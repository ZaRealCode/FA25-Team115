import React from 'react';

const PlayingCard = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <div
      data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      className="playing-card cursor-pointer p-8 h-64 flex flex-col items-center justify-center text-center relative group"
      style={{ borderColor: color }}
    >
      <div className="absolute top-4 left-4 text-2xl font-bold" style={{ color }}>
        ♥
      </div>
      <div className="absolute bottom-4 right-4 text-2xl font-bold rotate-180" style={{ color }}>
        ♥
      </div>
      
      <Icon className="w-16 h-16 mb-4 transition-transform group-hover:scale-110" style={{ color }} />
      <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-black relative">
      dashboard page
    </div>
  );
};

export default Dashboard;