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
import { ArrowLeft, FileText, Send, CheckCircle } from 'lucide-react';

const DateRecap = () => {
  const { token, user } = React.useContext(AuthContext); // get authentication token and user info from context
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [bets, setBets] = useState([]);
  const [dares, setDares] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ // form data state to track which dares were completed and results of bets
    happened: true,
    notes: '',
    completed_dares: [],
    bet_results: []
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get(`${API}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // ony show accepted proposals that user is the target of
      const myDates = response.data.filter(
        p => p.status === 'accepted' && p.target_user_id === user.id
      );
      setProposals(myDates);
    } catch (error) {
      toast.error('Failed to fetch proposals');
    }
  };

  const fetchProposalDetails = async (proposalId) => { 
    try {
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
      

      setFormData(prev => ({
        ...prev,
        bet_results: betsRes.data.map(bet => ({ bet_id: bet.id, won: false }))
      }));
    } catch (error) {
      toast.error('Failed to fetch date details');
    }
  };

  const handleProposalChange = (proposalId) => { // when user selects a different proposal
    setSelectedProposal(proposalId);
    if (proposalId) {
      fetchProposalDetails(proposalId);
    } else {
      setBets([]);
      setDares([]);
    }
  };

  const toggleBetResult = (betId) => { // toggle win/loss for a bet
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
      toast.error('Please select a date'); // simple validation
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${API}/outcomes`,
        { ...formData, proposal_id: selectedProposal }, // include proposal ID in submission
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Date recap submitted!');
      navigate('/active');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit recap'); // show specific error if available
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      date recap page
    </div>
  );
};

export default DateRecap;