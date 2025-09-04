import React, { useEffect, useState } from 'react';
import { Button } from '@components/atoms/Button';

export const ThemeToggle: React.FC = () => {
  const [dark,setDark] = useState<boolean>(()=> (localStorage.getItem('theme')||'light')==='dark');
  useEffect(()=>{
    const root = document.documentElement;
    if(dark){ root.classList.add('dark'); localStorage.setItem('theme','dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light'); }
  },[dark]);
  return <Button variant="ghost" onClick={()=>setDark(d=>!d)} aria-label="Toggle theme">{dark? '🌙':'☀️'}</Button>;
};

export default ThemeToggle;
