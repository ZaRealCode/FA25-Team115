import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Check, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ActiveDates = () => {
  const { token, user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { //running only once when the page loads
    fetchProposals();
  }, []);

  const fetchProposals = async () => { //fetching all proposals from backend
    try {
      const response = await axios.get(`${API}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProposals(response.data);//saving the  proposals
    } catch (error) {
      toast.error('Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (proposalId) => {//accepting one 
    try {
      await axios.put(`${API}/proposals/${proposalId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Proposal accepted! Time to roll the dice!');
      fetchProposals();
    } catch (error) {
      toast.error('Failed to accept proposal');
    }
  };

  const handleDecline = async (proposalId) => {//decling proposal
    try {
      await axios.put(`${API}/proposals/${proposalId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Proposal declined');
      fetchProposals();
    } catch (error) {
      toast.error('Failed to decline proposal');
    }
  };

  const viewBets = async (proposal) => {//loading bets for a proposal
    setSelectedProposal(proposal);
    try {
      const response = await axios.get(`${API}/bets/${proposal.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBets(response.data);
    } catch (error) {
      toast.error('Failed to fetch bets');
    }
  };

  const getStatusBadge = (status) => {//a badge color is chosen based on status here
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      accepted: 'bg-green-500/20 text-green-500 border-green-500/50',
      declined: 'bg-gray-500/20 text-gray-500 border-gray-500/50',
      completed: 'bg-blue-500/20 text-blue-500 border-blue-500/50'
    };
    return colors[status] || '';
  };

  if (loading) {//basic loading screen format here
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="grunge-overlay"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-40 h-40 bg-red-600 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
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
          <Users className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white glow-text mb-2">Active Dates</h1>
          <p className="text-gray-400">Manage your date proposals and wagers</p>
        </div>

        {proposals.length === 0 ? (
          <Card className="bg-black/50 border-2 border-red-600/30">
            <CardContent className="py-12 text-center">
              <p className="text-gray-400">No active proposals yet. Time to play matchmaker!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm" data-testid={`proposal-${proposal.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-white mb-2">
                        {proposal.target_username} + {proposal.proposed_match_name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Proposed by <span className="text-pink-500">{proposal.proposer_username}</span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusBadge(proposal.status)} border`}>
                      {proposal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Stakes:</p>
                      <p className="text-white">{proposal.stakes}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {proposal.status === 'pending' && proposal.target_user_id === user.id && (
                        <>
                          <Button
                            data-testid={`accept-${proposal.id}`}
                            onClick={() => handleAccept(proposal.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            data-testid={`decline-${proposal.id}`}
                            onClick={() => handleDecline(proposal.id)}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      <Button
                        data-testid={`view-bets-${proposal.id}`}
                        onClick={() => viewBets(proposal)}
                        variant="outline"
                        className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Bets
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bets Dialog */}
      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="bg-black border-red-600 text-white">
          <DialogHeader>
            <DialogTitle>Wagers on this Date</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedProposal?.target_username} + {selectedProposal?.proposed_match_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {bets.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No bets placed yet</p>
            ) : (
              bets.map((bet) => (
                <div key={bet.id} className="bg-black/50 border border-red-600/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-gray-400">{bet.bet_creator_username}</p>
                    {bet.completed && (
                      <Badge className={bet.won ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                        {bet.won ? 'Won' : 'Lost'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-white mb-2">{bet.bet_description}</p>
                  <p className="text-sm text-pink-500">Stakes: {bet.stake}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDates;