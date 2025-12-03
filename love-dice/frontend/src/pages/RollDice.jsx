import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Dice1, Heart } from 'lucide-react';


const RollDice = () => {
  const { token, user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // local state
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [rolling, setRolling] = useState(false);
  const [dare, setDare] = useState(null);

  // load!
  useEffect(() => {
    fetchProposals();
  }, []);

  // get da good propsals
  const fetchProposals = async () => {
    try {
      const response = await axios.get(`${API}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeDates = response.data.filter(p => ['accepted'].includes(p.status));
      setProposals(activeDates);
    } catch (error) {
      toast.error('Failed to fetch proposals');
    }
  };

  // roll dice  request a dare
  const rollDice = async () => {
    // basic validation
    if (!selectedProposal || !selectedGender) {
      toast.error('Please select a date and gender');
      return;
    }

    // start roll animation
    setRolling(true);
    setDare(null);

    // deelay
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${API}/dares/roll`,
          {
            proposal_id: selectedProposal,
            gender: selectedGender
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDare(response.data);
        toast.success('Dare generated!');
      } catch (error) {
        toast.error('Failed to generate dare');
      } finally {
        // end roll animation
        setRolling(false);
      }
    }, 1500);
  };

  // render heart icons based on roll number
  const renderDice = (number) => {
    const hearts = [];
    for (let i = 0; i < number; i++) {
      hearts.push(
        <Heart
          key={i}
          className="w-6 h-6 text-red-500 fill-red-500"
        />
      );
    }
    return hearts;
  };

  // main layout
  return (
    <div className="min-h-screen bg-black relative">
      <div className="grunge-overlay"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-40 h-40 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>


      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">

        <Button
          data-testid="back-button"
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-6 text-white hover:text-pink-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>


        <div className="text-center mb-8">
          <Dice1 className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white glow-text mb-2">Roll the Dice</h1>
          <p className="text-gray-400">Generate gender-aware date dares</p>
        </div>


        <Card className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Dare Generator</CardTitle>
            <CardDescription className="text-gray-400">
              Roll the heart-pipped dice to get a dare for the date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* proposal select */}
            <div>
              <Label htmlFor="proposal" className="text-white">Select Date</Label>
              <Select value={selectedProposal} onValueChange={setSelectedProposal}>
                <SelectTrigger data-testid="proposal-select" className="bg-black/50 border-gray-700 text-white">
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  {proposals.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center">No accepted dates</div>
                  ) : (
                    proposals.map((proposal) => (
                      <SelectItem key={proposal.id} value={proposal.id}>
                        {proposal.target_username} + {proposal.proposed_match_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>


            <div>
              <Label htmlFor="gender" className="text-white">Gender (for dare list)</Label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger data-testid="gender-select" className="bg-black/50 border-gray-700 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

    
            <Button
              data-testid="roll-dice-button"
              onClick={rollDice}
              disabled={rolling}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              {rolling ? 'Rolling...' : (
                <>
                  <Dice1 className="w-4 h-4 mr-2" />
                  Roll Dice
                </>
              )}
            </Button>
          </CardContent>
        </Card>

 
        {rolling && (
          <div className="flex justify-center mb-8">
            <div className="dice-rolling bg-black/50 border-4 border-red-600 rounded-2xl w-40 h-40 flex items-center justify-center">
              <Dice1 className="w-24 h-24 text-red-500" />
            </div>
          </div>
        )}


        {dare && !rolling && (
          <Card className="bg-gradient-to-br from-red-900/30 to-pink-900/30 border-2 border-red-500 backdrop-blur-sm" data-testid="dare-result">
            <CardHeader>
  
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-black/50 border-2 border-red-600 rounded-xl w-24 h-24 flex flex-wrap items-center justify-center gap-1 p-2">
                  {renderDice(dare.roll_number)}
                </div>
              </div>
              <CardTitle className="text-3xl text-center text-white">You rolled a {dare.roll_number}!</CardTitle>
            </CardHeader>
            <CardContent>
   
              <div className="bg-black/50 border border-red-500/50 rounded-lg p-6 text-center">
                <p className="text-xl text-white font-medium mb-2">Your Dare:</p>
                <p className="text-2xl text-pink-400">"{dare.dare_text}"</p>
              </div>
              <p className="text-center text-gray-400 mt-4 text-sm">
                Complete this during the date for ultimate bragging rights!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RollDice;
