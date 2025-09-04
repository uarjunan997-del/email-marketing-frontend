import React, { ReactNode, useEffect } from 'react';
import clsx from 'clsx';

interface ModalProps { open:boolean; onClose:()=>void; title?:string; children:ReactNode; size?:'sm'|'md'|'lg'; }

export const Modal: React.FC<ModalProps> = ({open,onClose,title,children,size='md'}) => {
  useEffect(()=>{ if(open){ const handler=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); }; window.addEventListener('keydown',handler); return ()=>window.removeEventListener('keydown',handler);} },[open,onClose]);
  if(!open) return null;
  const widths = {sm:'max-w-sm', md:'max-w-lg', lg:'max-w-3xl'};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg', widths[size])}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Close">✕</button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
