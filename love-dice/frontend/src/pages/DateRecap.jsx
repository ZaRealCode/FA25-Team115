import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

const DateRecap = () => {
  const { token, user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  // store accepted date proposals to choose from
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [bets, setBets] = useState([]);
  //fetched dares for the proposal
  const [dares, setDares] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // recap form!!!!!!
  const [formData, setFormData] = useState({
    happened: true,          // whether date actually happened??
    notes: '',               //optional recap 
    completed_dares: [],     //list of dare ids completed
    bet_results: []         
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      // fetch all proposals for people who ar elogged in!
      const response = await axios.get(`${API}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      //keep only accepted proposals 
      const myDates = response.data.filter(
        p => p.status === 'accepted' && p.target_user_id === user.id
      );

      // update dropdown list
      setProposals(myDates);
    } catch (error) {
      toast.error('Failed to fetch proposals');
    }
  };

  const fetchProposalDetails = async (proposalId) => {
    try {
      //fetch bets n dares
      const [betsRes, daresRes] = await Promise.all([
        axios.get(`${API}/bets/${proposalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/dares/${proposalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setBets(betsRes.data);
      setDares(daresRes.data);

      //initialize bet results state
      setFormData(prev => ({
        ...prev,
        bet_results: betsRes.data.map(bet => ({ bet_id: bet.id, won: false }))
      }));
    } catch (error) {
      toast.error('Failed to fetch date details');
    }
  };

  const handleProposalChange = (proposalId) => {
    // update selected proposal in dropdown
    setSelectedProposal(proposalId);

    if (proposalId) {
      fetchProposalDetails(proposalId);
    } else {
      //clear UI lists 
      setBets([]);
      setDares([]);
    }
  };

  const toggleBetResult = (betId) => {
    //flip won flag 
    setFormData(prev => ({
      ...prev,
      bet_results: prev.bet_results.map(br =>
        br.bet_id === betId ? { ...br, won: !br.won } : br
      )
    }));
  };

  const toggleDare = (dareId) => {
    setFormData(prev => ({
      ...prev,
      completed_dares: prev.completed_dares.includes(dareId)
        ? prev.completed_dares.filter(id => id !== dareId)
        : [...prev.completed_dares, dareId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProposal) {
      toast.error('Please select a date');
      return;
    }

    setIsLoading(true);

    try {
      //give re cap outcome to backend
      await axios.post(
        `${API}/outcomes`,
        { ...formData, proposal_id: selectedProposal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Date recap submitted!');
      navigate('/active');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit recap');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="grunge-overlay"></div>

      {/* subtle blurred background blobbies!!! */}
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

        {/* page header */}
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white glow-text mb-2">Date Recap</h1>
          <p className="text-gray-400">Log the outcome and settle the bets</p>
        </div>

        {/* main recap form card */}
        <Card className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">How Did It Go?</CardTitle>
            <CardDescription className="text-gray-400">
              Share what happened and mark which bets were won
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* proposal/date selector */}
              <div>
                <Label htmlFor="proposal" className="text-white">Select Date</Label>
                <Select value={selectedProposal} onValueChange={handleProposalChange}>
                  <SelectTrigger data-testid="proposal-select" className="bg-black/50 border-gray-700 text-white">
                    <SelectValue placeholder="Choose a date to recap" />
                  </SelectTrigger>

                  <SelectContent className="bg-black border-gray-700">
                    {proposals.length === 0 ? (
                      <div className="p-4 text-gray-400 text-center">No accepted dates</div>
                    ) : (
                      //list accepted proposal as an option
                      proposals.map((proposal) => (
                        <SelectItem key={proposal.id} value={proposal.id}>
                          {proposal.target_username} + {proposal.proposed_match_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-gray-700">
                <div>
                  <Label htmlFor="happened" className="text-white">Did the date happen?</Label>
                  <p className="text-sm text-gray-400">Let everyone know if you went through with it</p>
                </div>

                <Switch
                  id="happened"
                  data-testid="happened-switch"
                  checked={formData.happened}
                  onCheckedChange={(checked) => setFormData({ ...formData, happened: checked })}
                />
              </div>


              <div>
                <Label htmlFor="notes" className="text-white">Date Notes</Label>
                <Textarea
                  id="notes"
                  data-testid="notes-input"
                  placeholder="Share how it went... (optional but fun for everyone!)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 min-h-32"
                />
              </div>

              {dares.length > 0 && (
                <div>
                  <Label className="text-white mb-3 block">Completed Dares</Label>
                  <div className="space-y-3">
                    {dares.map((dare) => (
                      <div
                        key={dare.id}
                        className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-gray-700"
                      >
                        <Checkbox
                          data-testid={`dare-${dare.id}`}
                          checked={formData.completed_dares.includes(dare.id)}
                          onCheckedChange={() => toggleDare(dare.id)}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <p className="text-white">{dare.dare_text}</p>
                          <p className="text-sm text-gray-400 mt-1">Rolled: {dare.roll_number} hearts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bets.length > 0 && (
                <div>
                  <Label className="text-white mb-3 block">Settle Bets (Check if Won)</Label>
                  <div className="space-y-3">
                    {bets.map((bet) => (
                      <div
                        key={bet.id}
                        className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-gray-700"
                      >
                        <Checkbox
                          data-testid={`bet-${bet.id}`}
                          checked={formData.bet_results.find(br => br.bet_id === bet.id)?.won || false}
                          onCheckedChange={() => toggleBetResult(bet.id)}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <p className="text-white">{bet.bet_description}</p>
                          <p className="text-sm text-pink-400 mt-1">
                            By {bet.bet_creator_username} - Stakes: {bet.stake}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/*submit button */}
              <Button
                data-testid="submit-recap-button"
                type="submit"
                disabled={isLoading || !selectedProposal}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {isLoading ? 'Submitting...' : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Recap
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🎲 Honor system!! Be honest about the outcomes for maximum fun!</p>
        </div>
      </div>
    </div>
  );
};

export default DateRecap;
