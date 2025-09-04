import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { resolveApiBase } from '@utils/apiClient';

interface User { id: string; username?: string; email: string; firstName?: string; lastName?: string; roles?: string[]; planTier?: string; currency?: string; locale?: string; }
interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => { const ctx = useContext(AuthContext); if(!ctx) throw new Error('useAuth inside provider'); return ctx; };

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user,setUser] = useState<User|null>(null);
  const [token,setToken] = useState<string|null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if(t && u){ setToken(t); setUser(JSON.parse(u)); }
    setLoading(false);
  },[]);

  const apiBase = resolveApiBase();

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(apiBase + '/auth/login',{method:'POST', headers:{'Content-Type':'application/json','X-Auth-Attempt':'true'}, body: JSON.stringify({username,password})});
      if(!res.ok) throw new Error('Login failed');
      const data = await res.json();
      const userObj: User = data.user ? data.user : {
        id: String(data.id),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles ? Array.from(data.roles) : undefined
      };
      setToken(data.token); setUser(userObj); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(userObj));
      toast.success('Logged in');
    } finally { setLoading(false); }
  };

  const register = async (email:string,password:string, firstName?:string,lastName?:string) => {
    setLoading(true);
    try {
      const res = await fetch(apiBase + '/auth/register',{method:'POST', headers:{'Content-Type':'application/json','X-Auth-Attempt':'true'}, body: JSON.stringify({email,password, firstName,lastName})});
      if(!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      const userObj: User = data.user ? data.user : {
        id: String(data.id),
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles ? Array.from(data.roles) : undefined
      };
      setToken(data.token); setUser(userObj); localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(userObj));
      toast.success('Account created');
    } finally { setLoading(false); }
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('token'); localStorage.removeItem('user'); toast.success('Logged out'); };

  return <AuthContext.Provider value={{user,token,loading,login,register,logout}}>{children}</AuthContext.Provider>;
};
