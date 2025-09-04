import React, { useCallback, useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { Button } from '@components/atoms/Button';
import { Modal } from '@components/ui/Modal';

export interface EmailEditorWrapperProps {
  initialDesign?: any;
  onSave: (design:any, html:string) => Promise<void> | void;
  onClone?: () => void;
  onSendTest?: (email:string) => Promise<void> | void;
  isSaving?: boolean;
  meta?: {name:string; subject:string; preheader?:string; tags?:string[]};
  onMetaChange?: (meta:{name:string; subject:string; preheader?:string; tags?:string[]})=>void;
}

const VARIABLES = [
  {group:'Contact', vars:['contact.firstName','contact.lastName','contact.email']},
  {group:'Company', vars:['company.name','company.address','company.unsubscribeLink']}
];

export const EmailEditorWrapper: React.FC<EmailEditorWrapperProps> = ({initialDesign, onSave, onClone, onSendTest, isSaving, meta:incomingMeta, onMetaChange}) => {
  const editorRef = useRef<any>(null);
  const [preview,setPreview] = useState(false);
  const [previewHtml,setPreviewHtml] = useState('');
  const [testModal,setTestModal] = useState(false);
  const [testEmail,setTestEmail] = useState('');
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [meta,setMeta] = useState({name: incomingMeta?.name || 'Untitled Template', subject: incomingMeta?.subject||'', preheader: incomingMeta?.preheader||'', tags: (incomingMeta?.tags||[]).join(',')});
  const [device,setDevice] = useState<'desktop'|'mobile'>('desktop');

  const exportHtml = useCallback(()=> new Promise<{design:any; html:string}>(resolve => {
    editorRef.current?.editor?.exportHtml((data:any)=>{ resolve(data); });
  }),[]);

  const handleSave = async () => {
    const { design, html } = await exportHtml();
    await onSave(design, html);
  };

  const insertVariable = (v:string) => {
    try { editorRef.current?.editor?.pasteHtml?.(`{{${v}}}`) || editorRef.current?.editor?.insertText?.(`{{${v}}}`); } catch(e){ console.warn('Variable insert fallback', e); }
  };

  const togglePreview = async () => {
    if(!preview){ const { html } = await exportHtml(); setPreviewHtml(html); }
    setPreview(p=>!p);
  };

  const handleSendTest = async () => { if(onSendTest && testEmail){ await onSendTest(testEmail); setTestModal(false); } };

  const responsiveWrapperClass = device==='mobile' ? 'mx-auto w-[390px] border border-gray-300 dark:border-gray-700 shadow bg-white dark:bg-gray-900' : '';

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 flex-wrap border-b border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-900">
          <Button onClick={handleSave} loading={isSaving}>Save</Button>
          {onClone && <Button variant="secondary" onClick={onClone}>Clone</Button>}
          <Button variant="ghost" onClick={togglePreview}>{preview? 'Close Preview':'Preview'}</Button>
          {onSendTest && <Button variant="secondary" onClick={()=>setTestModal(true)}>Send Test</Button>}
          <Button variant="ghost" onClick={()=>setSettingsOpen(true)}>Settings</Button>
          <div className="ml-auto flex items-center gap-1 text-xs">
            <span>Device:</span>
            <Button variant={device==='desktop'?'primary':'ghost'} onClick={()=>setDevice('desktop')}>Desktop</Button>
            <Button variant={device==='mobile'?'primary':'ghost'} onClick={()=>setDevice('mobile')}>Mobile</Button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* Variable panel */}
          <aside className="w-56 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 space-y-4 overflow-y-auto hidden md:block">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 text-gray-500">Variables</h4>
              {VARIABLES.map(g=> (
                <div key={g.group} className="mb-3">
                  <div className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">{g.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.vars.map(v=> <button key={v} onClick={()=>insertVariable(v)} className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-[11px] hover:bg-primary-200 dark:hover:bg-primary-800">{v.split('.').slice(-1)}</button>)}
                  </div>
                </div>
              ))}
            </div>
          </aside>
          {/* Editor / Preview */}
          <div className="flex-1 relative overflow-auto">
            {!preview && <div className={responsiveWrapperClass + ' h-full'}>
              <EmailEditor ref={editorRef} minHeight="100%" appearance={{ theme: document.documentElement.classList.contains('dark')? 'dark':'light', panels:{ tools:{ dock:'left'} }}} options={{locale:'en'}} onLoad={()=>{ if(initialDesign) editorRef.current?.editor?.loadDesign(initialDesign); }} />
            </div>}
            {preview && <div className="p-4 flex justify-center">
              <div className={responsiveWrapperClass + ' w-full bg-white dark:bg-gray-900'}>
                <iframe title="Template Preview" className="w-full min-h-[600px] bg-white" srcDoc={previewHtml} />
              </div>
            </div>}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={testModal} onClose={()=>setTestModal(false)} title="Send Test Email">
        <div className="space-y-3">
          <label className="block text-xs font-medium">Recipient Email
            <input type="email" className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" value={testEmail} onChange={e=>setTestEmail(e.target.value)} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={()=>setTestModal(false)}>Cancel</Button>
            <Button onClick={handleSendTest} disabled={!testEmail}>Send</Button>
          </div>
        </div>
      </Modal>
      <Modal open={settingsOpen} onClose={()=>setSettingsOpen(false)} title="Template Settings">
        <form className="space-y-4" onSubmit={e=>{ e.preventDefault(); setSettingsOpen(false); }}>
          <div>
            <label className="block text-xs font-medium">Name
              <input className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" value={meta.name} onChange={e=>{ const v = e.target.value; setMeta(m=>({...m,name:v})); onMetaChange?.({name:v, subject:meta.subject, preheader:meta.preheader, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
            </label>
          </div>
            <label className="block text-xs font-medium">Subject
              <input className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" value={meta.subject} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,subject:v})); onMetaChange?.({name:meta.name, subject:v, preheader:meta.preheader, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
            </label>
            <label className="block text-xs font-medium">Preheader
              <input className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" value={meta.preheader} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,preheader:v})); onMetaChange?.({name:meta.name, subject:meta.subject, preheader:v, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
            </label>
            <label className="block text-xs font-medium">Tags (comma separated)
              <input className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" value={meta.tags} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,tags:v})); onMetaChange?.({name:meta.name, subject:meta.subject, preheader:meta.preheader, tags: v.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
            </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={()=>setSettingsOpen(false)}>Close</Button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmailEditorWrapper;
