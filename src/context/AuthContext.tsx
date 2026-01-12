import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';
import uuid from 'react-native-uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (userToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    country: string,
    state: string,
    city: string
  ) => {
    setIsLoading(true);
    try {
      // Validar que el usuario no exista
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const userExists = users.some(
        (u: any) => u.username === username || u.email === email
      );

      if (userExists) {
        throw new Error('El usuario o email ya existe');
      }

      const newUser: User = {
        id: uuid.v4().toString(),
        username,
        email,
        phone,
        address,
        country,
        state,
        city,
        createdAt: new Date().toISOString(),
      };

      // Guardar datos del usuario
      const storedUsers = await AsyncStorage.getItem('allUsers');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      allUsers.push(newUser);
      await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));

      // Guardar credenciales
      const userCredentials = {
        userId: newUser.id,
        username,
        email,
        password,
      };
      users.push(userCredentials);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      await AsyncStorage.setItem('userToken', newUser.id);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Para desarrollo: crear usuario sin validación
      const userData: User = {
        id: uuid.v4().toString(),
        username,
        email: `${username}@minimarket.com`,
        phone: '1234567890',
        address: 'Dirección por defecto',
        country: 'México',
        state: 'Estado por defecto',
        city: 'Ciudad por defecto',
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userToken', userData.id);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    // También actualizar en allUsers si es necesario
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    register,
    login,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
