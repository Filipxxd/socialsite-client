import React, { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { setTokens, loadTokensFromStorage, getAccessToken } from './tokenManager';
import { ClaimType_Role } from "../../_constants/claimTypes.constants.tsx";

type DecodedToken = {
  userId: string;
  fullname: string;
  userClaims: { type: string; value: string }[];
  exp: number;
}

type AuthContextProps = {
  fullname: string;
  userId: string;
  userClaims: { type: string; value: string }[];
  roles: string[];
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
  const roles = (decoded.userClaims || [])
    .filter(claim => claim.type.includes(ClaimType_Role))
    .map(claim => claim.value);

  return {
    fullname: decoded.fullname,
    userId: decoded.userId,
    userClaims: decoded.userClaims || [],
    roles,
    isAuthenticated: true,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => {
    loadTokensFromStorage();
    const accessToken = getAccessToken();
    if (accessToken) {
      return decodeTokenAndGetState(accessToken);
    }
    return {
      fullname: '',
      userId: '',
      userClaims: [],
      roles: [],
      isAuthenticated: false,
    };
  });

  const login = (accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    setState(decodeTokenAndGetState(accessToken));
  };

  const logout = () => {
    setTokens('', '');
    setState({
      fullname: '',
      userId: '',
      userClaims: [],
      roles: [],
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};