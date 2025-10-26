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
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

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
      <div className="grunge-overlay"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-40 h-40 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white glow-text mb-2">loveDice</h1>
            <p className="text-gray-400">Welcome back, <span className="text-pink-500">{user?.username}</span></p>
          </div>
          <Button
            data-testid="logout-button"
            onClick={logout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Play</h2>
          <p className="text-gray-400">Select a card to get started</p>
        </div>

        <div className="carousel-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PlayingCard
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
                onClick={() => navigate(card.path)}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-black/50 border border-red-600/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">♥</div>
            <div className="text-gray-400 text-sm">Your next date adventure awaits</div>
          </div>
          <div className="bg-black/50 border border-pink-600/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-500 mb-2">♠</div>
            <div className="text-gray-400 text-sm">Friends making matches for you</div>
          </div>
          <div className="bg-black/50 border border-red-600/30 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">♦</div>
            <div className="text-gray-400 text-sm">Bets placed on your love life</div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;