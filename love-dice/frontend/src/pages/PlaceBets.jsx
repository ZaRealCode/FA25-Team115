import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, DollarSign, Send } from 'lucide-react';

const PlaceBets = () => {
  const { token } = React.useContext(AuthContext); //getting the user token so api call can happen ig
  const navigate = useNavigate(); //to go to next page
  const [proposals, setProposals] = useState([]);//list of proposals
  const [isLoading, setIsLoading] = useState(false);//loading state for submit button
  const [formData, setFormData] = useState({//form data state
    proposal_id: '',
    bet_description: '',
    stake: '',
    is_hidden: false //whether the bet is hidden or not
  });

  useEffect(() => {//fetch proposals on component (get this checked tho)
    fetchProposals();
  }, []);

  const fetchProposals = async () => {//fetch proposals from backend
    try {
      const response = await axios.get(`${API}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter accepted or pending proposals
      const activeDates = response.data.filter(p => ['pending', 'accepted'].includes(p.status));
      setProposals(activeDates);
    } catch (error) {
      toast.error('Failed to fetch proposals');
    }
  };

  const handleSubmit = async (e) => {//handle submission
    e.preventDefault();//dont reload againnnn
    if (!formData.proposal_id) {
      toast.error('Please select a date');
      return;
    }
    setIsLoading(true);//this just like shows the loading state on the button
    try {
      await axios.post(`${API}/bets`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bet placed!');//tell the user everything worked
      navigate('/active');
    } catch (error) {//if the server like sends an error message, show it then
      toast.error(error.response?.data?.detail || 'Failed to place bet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="grunge-overlay"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-40 h-40 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
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
          <DollarSign className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white glow-text mb-2">Place a Bet</h1>
          <p className="text-gray-400">Add your wager to an active date</p>
        </div>

        <Card className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Make Your Wager</CardTitle>
            <CardDescription className="text-gray-400">
              Pick a date and bet on what will happen. Stakes are fun commitments, not money!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="proposal" className="text-white">Select Date</Label>
                <Select
                  value={formData.proposal_id}
                  onValueChange={(value) => setFormData({ ...formData, proposal_id: value })}
                  required
                >
                  <SelectTrigger data-testid="proposal-select" className="bg-black/50 border-gray-700 text-white">
                    <SelectValue placeholder="Choose a date to bet on" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    {proposals.length === 0 ? (
                      <div className="p-4 text-gray-400 text-center">No active dates</div>
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

              //like a text area where the user types what their bet is
              <div>
                <Label htmlFor="bet-description" className="text-white">Your Bet</Label>
                <Textarea
                  id="bet-description"
                  data-testid="bet-description-input"
                  placeholder="What are you betting will happen? (e.g., 'I bet they split the bill', 'I bet he mentions Pokémon')" 
                  value={formData.bet_description}
                  onChange={(e) => setFormData({ ...formData, bet_description: e.target.value })}
                  required
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 min-h-24"
                />
              </div>

              //input where the user types what their stake is and what theyy  will do if they lose
              <div>
                <Label htmlFor="stake" className="text-white">Your Stake</Label>
                <Input
                  id="stake"
                  data-testid="stake-input"
                  type="text"
                  placeholder="What will you do if you're wrong? (e.g., 'Buy them ice cream')" 
                  value={formData.stake}
                  onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                  required
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              //just a toggle button to make the bet hidden or not
              <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-gray-700">
                <div>
                  <Label htmlFor="hidden" className="text-white">Hidden Bet</Label>
                  <p className="text-sm text-gray-400">Only you will see this bet until the date is over</p>
                </div>
                <Switch
                  id="hidden"
                  data-testid="hidden-switch"
                  checked={formData.is_hidden}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_hidden: checked })}
                />
              </div>

              <Button //its the submit button to send the final bet to the serer
                data-testid="submit-bet-button" 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {isLoading ? 'Placing...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Place Bet
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PlaceBets;