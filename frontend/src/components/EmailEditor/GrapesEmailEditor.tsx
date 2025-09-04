import React, { useEffect, useRef, useState, useCallback } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter';
import { Button } from '@components/atoms/Button';
import { Modal } from '@components/ui/Modal';

interface Props {
  initialHtml?: string;
  onSave: (design:any, html:string) => Promise<void>|void;
  onClone?: ()=>void;
  onSendTest?: (email:string)=>Promise<void>|void;
  isSaving?: boolean;
  meta?: {name:string; subject:string; preheader?:string; tags?:string[]};
  onMetaChange?: (meta:{name:string; subject:string; preheader?:string; tags?:string[]})=>void;
}

// We store raw HTML as design for now (GrapesJS JSON could be used: editor.getProjectData())
const GrapesEmailEditor: React.FC<Props> = ({initialHtml,onSave,onClone,onSendTest,isSaving,meta:onMetaChangeInput,onMetaChange}) => {
  const editorRef = useRef<Editor|null>(null);
  const containerRef = useRef<HTMLDivElement|null>(null);
  const [preview,setPreview] = useState(false);
  const [htmlPreview,setHtmlPreview] = useState('');
  const [testModal,setTestModal] = useState(false);
  const [testEmail,setTestEmail] = useState('');
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [meta,setMeta] = useState({name:onMetaChangeInput?.name||'Untitled Template', subject:onMetaChangeInput?.subject||'', preheader:onMetaChangeInput?.preheader||'', tags:(onMetaChangeInput?.tags||[]).join(',')});

  useEffect(()=>{
    if(!containerRef.current) return;
    const editor = grapesjs.init({
      container: containerRef.current,
      height: '100%',
      fromElement: false,
      storageManager: false,
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: { 'gjs-preset-newsletter': { inlineCss: true } },
      canvas: { styles: [] }
    });
    // Custom variable blocks
    const vars = [
      { name:'first_name', label:'First Name'},
      { name:'last_name', label:'Last Name'},
      { name:'unsubscribe_url', label:'Unsubscribe'}
    ];
    vars.forEach(v=>{
      editor.BlockManager.add('var-'+v.name, { label: v.label, category:'Variables', content: '{{'+v.name+'}}', attributes:{ class:'gjs-fonts gjs-f-text'}, activate:false });
    });

    if(initialHtml){ editor.setComponents(initialHtml); }
    editorRef.current = editor;
    return () => { editor.destroy(); };
  }, [initialHtml]);

  const exportHtml = useCallback(()=>{
    const editor = editorRef.current; if(!editor) return { design:null, html:''};
    const html = editor.getHtml() + '<style>'+ editor.getCss() + '</style>';
    // Use project data as design snapshot
    const design = editor.getProjectData();
    return { design, html };
  },[]);

  const handleSave = async () => {
    const { design, html } = exportHtml();
    await onSave(design, html);
  };

  const togglePreview = () => {
    if(!preview){ const { html } = exportHtml(); setHtmlPreview(html); }
    setPreview(p=>!p);
  };

  const handleSendTest = async () => { if(onSendTest && testEmail){ await onSendTest(testEmail); setTestModal(false);} };

  return (
    <div className='flex h-full w-full'>
      <div className='flex-1 flex flex-col min-w-0'>
        <div className='flex items-center gap-2 flex-wrap border-b border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-900'>
          <Button onClick={handleSave} loading={isSaving}>Save</Button>
          {onClone && <Button variant='secondary' onClick={onClone}>Clone</Button>}
          <Button variant='ghost' onClick={togglePreview}>{preview? 'Close Preview':'Preview'}</Button>
          {onSendTest && <Button variant='secondary' onClick={()=>setTestModal(true)}>Send Test</Button>}
          <Button variant='ghost' onClick={()=>setSettingsOpen(true)}>Settings</Button>
        </div>
        <div className='flex-1 relative'>
          {!preview && <div ref={containerRef} className='h-full' />}
          {preview && <div className='p-4'><iframe title='Preview' className='w-full min-h-[600px] bg-white' srcDoc={htmlPreview} /></div>}
        </div>
      </div>
      <Modal open={testModal} onClose={()=>setTestModal(false)} title='Send Test Email'>
        <div className='space-y-3'>
          <label className='block text-xs font-medium'>Recipient Email
            <input type='email' className='mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm' value={testEmail} onChange={e=>setTestEmail(e.target.value)} />
          </label>
          <div className='flex justify-end gap-2'>
            <Button variant='ghost' onClick={()=>setTestModal(false)}>Cancel</Button>
            <Button onClick={handleSendTest} disabled={!testEmail}>Send</Button>
          </div>
        </div>
      </Modal>
      <Modal open={settingsOpen} onClose={()=>setSettingsOpen(false)} title='Template Settings'>
        <form className='space-y-4' onSubmit={e=>{ e.preventDefault(); setSettingsOpen(false); }}>
          <label className='block text-xs font-medium'>Name
            <input className='mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm' value={meta.name} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,name:v})); onMetaChange?.({name:v, subject:meta.subject, preheader:meta.preheader, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
          </label>
          <label className='block text-xs font-medium'>Subject
            <input className='mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm' value={meta.subject} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,subject:v})); onMetaChange?.({name:meta.name, subject:v, preheader:meta.preheader, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
          </label>
          <label className='block text-xs font-medium'>Preheader
            <input className='mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm' value={meta.preheader} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,preheader:v})); onMetaChange?.({name:meta.name, subject:meta.subject, preheader:v, tags: meta.tags.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
          </label>
          <label className='block text-xs font-medium'>Tags (comma separated)
            <input className='mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm' value={meta.tags} onChange={e=>{ const v=e.target.value; setMeta(m=>({...m,tags:v})); onMetaChange?.({name:meta.name, subject:meta.subject, preheader:meta.preheader, tags: v.split(',').map(t=>t.trim()).filter(Boolean)}); }} />
          </label>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='ghost' onClick={()=>setSettingsOpen(false)}>Close</Button>
            <Button type='submit'>Apply</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GrapesEmailEditor;
