import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmailEditorWrapper from '@components/EmailEditor/EmailEditor';
import GrapesEmailEditor from '@components/EmailEditor/GrapesEmailEditor';
import EnhancedGrapesEditor from '@components/templates/EnhancedGrapesEditor';
import { useTemplateManager } from '@hooks/useTemplateManager';
import { debounce } from '@utils/debounce';
import toast from 'react-hot-toast';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { 
  ArrowLeft, 
  Wand2, 
  Sparkles, 
  Eye,
  Save,
  Settings
} from 'lucide-react';

const TemplateEditorPage: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { load, current, save, clone, sendTest, updateMeta } = useTemplateManager();
  const [saving,setSaving] = useState(false);
  const [historyOpen,setHistoryOpen] = useState(false);
  const [editorMode,setEditorMode] = useState<'enhanced' | 'grapes' | 'unlayer'>('enhanced');

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 p-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/templates')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Templates
            </Button>
            <div>
              <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                {current?.name || 'New Template'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {current?.subject || 'Email template editor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Editor Mode Selector */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
              <Button
                variant={editorMode === 'enhanced' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('enhanced')}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Enhanced
              </Button>
              <Button
                variant={editorMode === 'grapes' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('grapes')}
                icon={<Wand2 className="w-4 h-4" />}
              >
                GrapesJS
              </Button>
              <Button
                variant={editorMode === 'unlayer' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setEditorMode('unlayer')}
                icon={<Eye className="w-4 h-4" />}
              >
                Unlayer
              </Button>
            </div>

            {current?.versions && current.versions.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => setHistoryOpen(true)}
                icon={<Settings className="w-4 h-4" />}
              >
                History ({current.versions.length})
              </Button>
            )}

            <Button
              onClick={handleSave}
              loading={saving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Template
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {editorMode === 'enhanced' && (
            <motion.div
              key="enhanced"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-120px)]"
            >
              <EnhancedGrapesEditor
                initialHtml={current?.design?.html}
                initialCss={current?.design?.css}
                onSave={async (html, css) => {
                  await handleSave({ html, css }, html);
                }}
                loading={saving}
              />
            </motion.div>
          )}

          {editorMode === 'grapes' && (
            <motion.div
              key="grapes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-120px)]"
            >
              <GrapesEmailEditor
                initialHtml={current?.design?.html}
                meta={current ? { name: current.name, subject: current.subject, preheader: current.preheader, tags: current.tags } : undefined}
                onMetaChange={(m)=>{ if(current?.id) debouncedUpdateMeta({ id: current.id, name: m.name, subject: m.subject, preheader: m.preheader, tags: m.tags }); }}
                onSave={handleSave}
                onClone={handleClone}
                onSendTest={handleSendTest}
                isSaving={saving}
              />
            </motion.div>
          )}

          {editorMode === 'unlayer' && (
            <motion.div
              key="unlayer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-120px)]"
            >
              <EmailEditorWrapper
                initialDesign={current?.design}
                meta={current ? { name: current.name, subject: current.subject, preheader: current.preheader, tags: current.tags } : undefined}
                onMetaChange={(m)=>{ if(current?.id) debouncedUpdateMeta({ id: current.id, name: m.name, subject: m.subject, preheader: m.preheader, tags: m.tags }); }}
                onSave={handleSave}
                onClone={handleClone}
                onSendTest={handleSendTest}
                isSaving={saving}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Version History Modal */}
      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title="Version History" size="lg">
        <div className="max-h-96 overflow-y-auto space-y-3">
          {current?.versions?.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="sm">
                    Version {current.versions!.length - index}
                  </Badge>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(version.createdAt).toLocaleString()}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    if (!current?.id) return;
                    await save({
                      id: current.id,
                      name: current.name,
                      subject: current.subject,
                      preheader: current.preheader,
                      tags: current.tags,
                      design: version.design
                    });
                    toast.success('Version restored');
                    setHistoryOpen(false);
                  }}
                >
                  Restore
                </Button>
              </div>
              {version.htmlSnippet && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {version.htmlSnippet}
                </p>
              )}
            </motion.div>
          ))}
          
          {(!current?.versions || current.versions.length === 0) && (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">
                No version history available yet.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
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
