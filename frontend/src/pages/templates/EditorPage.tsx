import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmailEditorWrapper from '@components/EmailEditor/EmailEditor';
import GrapesEmailEditor from '@components/EmailEditor/GrapesEmailEditor';
import { useTemplateManager } from '@hooks/useTemplateManager';
import { debounce } from '@utils/debounce';
import toast from 'react-hot-toast';
import { Modal } from '@components/ui/Modal';

const TemplateEditorPage: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { load, current, save, clone, sendTest, updateMeta } = useTemplateManager();
  const [saving,setSaving] = useState(false);
  const [historyOpen,setHistoryOpen] = useState(false);
  const [useGrapes,setUseGrapes] = useState(false);

  useEffect(()=>{ if(templateId && templateId !== 'new') load(templateId); },[templateId, load]);

  const handleSave = async (design:any, html:string) => {
    setSaving(true);
    try {
      const rec = await save({ id: templateId==='new'? undefined: templateId, name: current?.name || 'Untitled Template', subject: current?.subject || 'Subject', design, preheader: current?.preheader, tags: current?.tags});
      toast.success('Template saved');
      if(templateId==='new') navigate(`/templates/${rec.id}`, {replace:true});
    } finally { setSaving(false); }
  };

  const handleClone = async () => {
    if(!templateId || templateId==='new') return;
    const rec = await clone(templateId); if(rec) { toast.success('Cloned'); navigate(`/templates/${rec.id}`); }
  };

  const handleSendTest = async (email:string) => {
    if(!templateId || templateId==='new'){ toast.error('Save template first'); return; }
    await sendTest(templateId, email); toast.success('Test sent (mock)');
  };

  const debouncedUpdateMeta = useMemo(()=> debounce(updateMeta, 600), [updateMeta]);

  return (
    <div className="h-[calc(100vh-56px)] -m-4"> {/* full height under header */}
      <div className="absolute top-16 right-4 z-10 flex gap-2">
        {current?.versions && current.versions.length>0 && <button onClick={()=>setHistoryOpen(true)} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">History ({current.versions.length})</button>}
        <button onClick={()=>setUseGrapes(v=>!v)} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">{useGrapes? 'Switch Old Editor':'Try New Editor'}</button>
      </div>
      {!useGrapes && <EmailEditorWrapper
          initialDesign={current?.design}
          meta={current ? { name: current.name, subject: current.subject, preheader: current.preheader, tags: current.tags } : undefined}
          onMetaChange={(m)=>{ if(current?.id) debouncedUpdateMeta({ id: current.id, name: m.name, subject: m.subject, preheader: m.preheader, tags: m.tags }); }}
          onSave={handleSave}
          onClone={handleClone}
          onSendTest={handleSendTest}
          isSaving={saving}
      />}
    {useGrapes && <GrapesEmailEditor
      initialHtml={current?.design?.html}
          meta={current ? { name: current.name, subject: current.subject, preheader: current.preheader, tags: current.tags } : undefined}
          onMetaChange={(m)=>{ if(current?.id) debouncedUpdateMeta({ id: current.id, name: m.name, subject: m.subject, preheader: m.preheader, tags: m.tags }); }}
          onSave={async (design, html)=>{
            await handleSave(design, html);
          }}
          onClone={handleClone}
          onSendTest={handleSendTest}
          isSaving={saving}
      />}
      <Modal open={historyOpen} onClose={()=>setHistoryOpen(false)} title="Version History">
        <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
          {current?.versions?.map(v=> (
            <div key={v.id} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span>{new Date(v.createdAt).toLocaleString()}</span>
                <button className="px-2 py-0.5 rounded bg-primary-600 text-white" onClick={async ()=>{
                  if(!current?.id) return; await save({ id: current.id, name: current.name, subject: current.subject, preheader: current.preheader, tags: current.tags, design: v.design }); toast.success('Version restored'); setHistoryOpen(false); }}>
                  Restore
                </button>
              </div>
              {v.htmlSnippet && <div className="line-clamp-2 opacity-70">{v.htmlSnippet}</div>}
            </div>
          ))}
          {(!current?.versions || current.versions.length===0) && <p>No versions yet.</p>}
        </div>
      </Modal>
    </div>
  );
};

export default TemplateEditorPage;
