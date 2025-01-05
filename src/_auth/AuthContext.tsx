import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { setTokens, loadTokensFromStorage, getAccessToken } from './tokenManager.ts';
import { subscribe, unsubscribe } from './authEventEmitter.ts';

type DecodedToken = {
  userId: string;
  username: string;
  role: string;
  exp: number;
}

type AuthContextProps = {
  username: string;
  userId: string;
  role: string;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const decodeTokenAndGetState = (token: string) => {
  const decoded = jwtDecode<DecodedToken>(token);

  // TODO: Check if token is expired
  // if (!decoded.exp)
  //   return;

  return {
    username: decoded.username,
    userId: decoded.userId,
    role: decoded.role,
    isAuthenticated: true,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => {
    loadTokensFromStorage();
    const accessToken = getAccessToken();
    if (accessToken)
      return decodeTokenAndGetState(accessToken);

    return {
      username: '',
      userId: '',
      role: '',
      isAuthenticated: false,
    };
  });

  useEffect(() => {
    subscribe('logout', logout);

    return () => {
      unsubscribe('logout', logout);
    };
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    setState(decodeTokenAndGetState(accessToken));
  };

  const logout = () => {
    setTokens('', '');

    setState({
      username: '',
      userId: '',
      role: '',
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};