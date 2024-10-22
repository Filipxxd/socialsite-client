import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { JWT_Key } from "../_constants/localStorage.constants";

interface AuthContextProps {
  token: string | null;
  fullname: string;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  fullname: string;
  roles: string[];
  exp: number;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem(JWT_Key);
    if (storedToken && !isTokenExpired(storedToken)) {
      handleToken(storedToken);
    } else {
      localStorage.removeItem(JWT_Key);
    }
  }, []);

  const handleToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem(JWT_Key, newToken);

    const decoded = jwtDecode<DecodedToken>(newToken);
    setFullname(decoded.fullname);
    setRoles(decoded.roles || []);
  };

  const login = (newToken: string) => {
    if (!isTokenExpired(newToken)) {
      handleToken(newToken);
    } else {
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setFullname("");
    setRoles([]);
    localStorage.removeItem(JWT_Key);
  };

  const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode<DecodedToken>(token);
    return !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000);
  };

  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider
      value={{ token, fullname, roles, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
