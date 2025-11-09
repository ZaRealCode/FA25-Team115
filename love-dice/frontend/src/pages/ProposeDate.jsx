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
