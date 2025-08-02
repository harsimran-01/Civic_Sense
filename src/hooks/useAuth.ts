import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('civictrack_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'Harsimran ',
      email,
      phone: '+1234567890',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
      points: 250,
      badges: [
        {
          id: '1',
          name: 'First Reporter',
          description: 'Reported your first issue',
          icon: '🎯',
          earnedAt: new Date()
        }
      ],
      reportsCount: 12,
      joinedAt: new Date()
    };
    
    setUser(mockUser);
    localStorage.setItem('civictrack_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name,
      email,
      phone,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150',
      points: 50,
      badges: [],
      reportsCount: 0,
      joinedAt: new Date()
    };
    
    setUser(mockUser);
    localStorage.setItem('civictrack_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civictrack_user');
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
};
