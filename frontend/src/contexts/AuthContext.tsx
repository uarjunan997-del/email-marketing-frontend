import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { resolveApiBase } from '@utils/apiClient';

interface User { id: string; username?: string; email: string; firstName?: string; lastName?: string; roles?: string[]; planTier?: string; currency?: string; locale?: string; }
interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
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
    if(t){
      setToken(t);
      // attempt to load profile silently
      fetchProfile(t).finally(()=> setLoading(false));
    } else {
      setLoading(false);
    }
  },[]);

  const apiBase = resolveApiBase();

  const fetchProfile = async (tk: string) => {
    try {
      const res = await fetch(apiBase + '/api/auth/me', { headers: { 'Authorization': 'Bearer ' + tk }});
      if(!res.ok) throw new Error('Profile load failed');
      const data = await res.json();
      const userObj: User = { id: String(data.id), username: data.username, email: data.email, roles: data.roles ? Array.from(data.roles) : undefined };
      setUser(userObj); localStorage.setItem('user', JSON.stringify(userObj));
    } catch {
      // silent failure -> force logout
      localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(apiBase + '/api/auth/login',{method:'POST', headers:{'Content-Type':'application/json','X-Auth-Attempt':'true'}, body: JSON.stringify({username,password})});
      if(!res.ok) throw new Error('Login failed');
      const data = await res.json();
      if(!data.accessToken) throw new Error('No token in response');
      setToken(data.accessToken); localStorage.setItem('token', data.accessToken);
      await fetchProfile(data.accessToken);
      toast.success('Logged in');
    } catch(err:any){ toast.error(err.message || 'Login failed'); throw err; }
    finally { setLoading(false); }
  };

  const register = async (username: string, email:string,password:string, firstName?:string,lastName?:string) => {
    setLoading(true);
    try {
      const res = await fetch(apiBase + '/api/auth/register',{method:'POST', headers:{'Content-Type':'application/json','X-Auth-Attempt':'true'}, body: JSON.stringify({username, email,password, firstName,lastName})});
      if(!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      if(!data.accessToken) throw new Error('No token in response');
      setToken(data.accessToken); localStorage.setItem('token', data.accessToken);
      await fetchProfile(data.accessToken);
      toast.success('Account created');
    } catch(err:any){ toast.error(err.message || 'Registration failed'); throw err; }
    finally { setLoading(false); }
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('token'); localStorage.removeItem('user'); toast.success('Logged out'); };

  return <AuthContext.Provider value={{user,token,loading,login,register,logout}}>{children}</AuthContext.Provider>;
};
