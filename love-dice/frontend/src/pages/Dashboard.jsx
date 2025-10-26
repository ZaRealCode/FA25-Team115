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

  const cards = [
    {
      title: 'Propose Date',
      description: 'Set up a friend with someone special',
      icon: Heart,
      color: '#FF1744',
      path: '/propose'
    },
    {
      title: 'Active Dates',
      description: 'View and manage date proposals',
      icon: Users,
      color: '#FF4081',
      path: '/active'
    },
    {
      title: 'Place Bets',
      description: 'Add wagers to ongoing dates',
      icon: DollarSign,
      color: '#C2185B',
      path: '/bets'
    },
    {
      title: 'Roll Dice',
      description: 'Generate date dares with the dice',
      icon: Dice1,
      color: '#FF1744',
      path: '/roll'
    },
    {
      title: 'Date Recap',
      description: 'Log outcomes and settle bets',
      icon: FileText,
      color: '#FF4081',
      path: '/recap'
    }
  ];
  return (
    <div className="min-h-screen bg-black relative">
      dashboard page
    </div>
  );
};

export default Dashboard;