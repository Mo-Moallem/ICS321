import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, User, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!username || !password) {
      setFormError('Please enter both username and password');
      return;
    }
    
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      // Error is already handled in context
    }
  };
  
  const handleGuestAccess = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Trophy className="h-16 w-16 text-blue-800" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Tournament Management System</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in as an administrator or continue as guest</p>
        </div>
        
        <Card>
          {error && (
            <Alert 
              variant="error" 
              message={error === 'Login failed' ? 'Invalid username or password' : error}
              className="mb-4"
            />
          )}
          
          {formError && (
            <Alert 
              variant="warning" 
              message={formError}
              className="mb-4"
            />
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              fullWidth
              icon={<User className="h-5 w-5 text-gray-400" />}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              fullWidth
              icon={<Lock className="h-5 w-5 text-gray-400" />}
            />
            
            <div className="flex flex-col space-y-4">
              <Button type="submit" fullWidth isLoading={isLoading}>
                Sign in
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                fullWidth
                onClick={handleGuestAccess}
              >
                Continue as Guest
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};