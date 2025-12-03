import React, { useState } from 'react';
import { AuthContext } from '@/App';
import axios from 'axios';
import { API } from '@/App';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Dice1, Users, Sparkles } from 'lucide-react';

const Landing = () => {
  const { login } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    gender: ''
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/auth/signup`, signupData);
      login(response.data.token, response.data.user);
      toast.success('Welcome to loveDice!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginData);
      login(response.data.token, response.data.user);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="grunge-overlay"></div>
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-700 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dice1 className="w-16 h-16 text-red-500" />
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white glow-text mb-4">
            loveDice
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Where friends become matchmakers and dates become wagers.
            <span className="text-pink-500"> Roll the dice on love.</span>
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              <span>Friend Proposals</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              <span>Social Wagers</span>
            </div>
            <div className="flex items-center gap-2">
              <Dice1 className="w-5 h-5 text-pink-500" />
              <span>Date Dares</span>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          <Card className="bg-black/50 border-2 border-red-600/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">Get Started</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Join the most playful dating experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-red-600">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-red-600">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-username" className="text-white">Username</Label>
                      <Input
                        id="login-username"
                        data-testid="login-username-input"
                        type="text"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password" className="text-white">Password</Label>
                      <Input
                        id="login-password"
                        data-testid="login-password-input"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      data-testid="login-submit-button"
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-username" className="text-white">Username</Label>
                      <Input
                        id="signup-username"
                        data-testid="signup-username-input"
                        type="text"
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        required
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        data-testid="signup-email-input"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <Input
                        id="signup-password"
                        data-testid="signup-password-input"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-gender" className="text-white">Gender</Label>
                      <Select
                        value={signupData.gender}
                        onValueChange={(value) => setSignupData({ ...signupData, gender: value })}
                        required
                      >
                        <SelectTrigger data-testid="signup-gender-select" className="bg-black/50 border-gray-700 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-700">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      data-testid="signup-submit-button"
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                    >
                      {isLoading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-red-600/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Friend Matchmaking</h3>
            <p className="text-gray-400">Your friends propose dates with playful stakes</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-pink-600/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Social Wagers</h3>
            <p className="text-gray-400">Bet fun stakes like treats, chores, or bragging rights</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-red-600/20 rounded-full flex items-center justify-center">
              <Dice1 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Dice Dares</h3>
            <p className="text-gray-400">Roll heart-pipped dice for gender-aware date dares</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;