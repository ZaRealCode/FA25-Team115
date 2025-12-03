import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API } from '@/App';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Send } from 'lucide-react';

const ProposeDate = () => {
  // Pull current user's auth  so we can make authorized requests
  const { token } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form values the user is filling out
  const [formData, setFormData] = useState({
    target_username: '',
    proposed_match_name: '',
    stakes: ''
  });

  // Handles sending the proposal to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Send the form data along with the user's auth token
      await axios.post(`${API}/proposals`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Date proposal sent!');
      navigate('/dashboard'); // Go back to the dashboard after sending
    } catch (error) {
      // Show specific backend error if available, fallback to generic
      toast.error(error.response?.data?.detail || 'Failed to send proposal');
    } finally {
      setIsLoading(false); // Stop the loading state either way
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
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white glow-text mb-2">Propose a Date</h1>
          <p className="text-gray-400">Play matchmaker for your friends</p>
        </div>

        <Card className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Set Up The Date</CardTitle>
            <CardDescription className="text-gray-400">
              Propose who should go on a date with whom, and what you'll stake if it doesn't work out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="target-username" className="text-white">Friend's Username</Label>
                <Input
                  id="target-username"
                  data-testid="target-username-input"
                  type="text"
                  placeholder="Who should go on this date?"
                  value={formData.target_username}
                  onChange={(e) => setFormData({ ...formData, target_username: e.target.value })}
                  required
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="match-name" className="text-white">Proposed Match</Label>
                <Input
                  id="match-name"
                  data-testid="match-name-input"
                  type="text"
                  placeholder="Who should they go with?"
                  value={formData.proposed_match_name}
                  onChange={(e) => setFormData({ ...formData, proposed_match_name: e.target.value })}
                  required
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="stakes" className="text-white">Your Stakes</Label>
                <Textarea
                  id="stakes"
                  data-testid="stakes-input"
                  placeholder="What will you do if it doesn't go well? (e.g., 'I'll buy you coffee for a week')" 
                  value={formData.stakes}
                  onChange={(e) => setFormData({ ...formData, stakes: e.target.value })}
                  required
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 min-h-24"
                />
              </div>

              <Button
                data-testid="submit-proposal-button"
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {isLoading ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Proposal
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>💡 Tip: Make your stakes fun and playful - this is all about good vibes!</p>
        </div>
      </div>
    </div>
  );
};
export default ProposeDate;