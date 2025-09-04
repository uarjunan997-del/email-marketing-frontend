import { useCallback, useEffect, useState } from 'react';
import { getTemplatesBackend, TemplateMeta, TemplateRecord, SaveTemplateInput, UpdateTemplateMetaInput } from '@api/templatesBackend';

export const useTemplateManager = () => {
  const [templates,setTemplates] = useState<TemplateMeta[]>([]);
  const [loading,setLoading] = useState(false);
  const [current,setCurrent] = useState<TemplateRecord | null>(null);
  const [filter,setFilter] = useState('');
  const [tagFilter,setTagFilter] = useState<string[]>([]);

  const backend = getTemplatesBackend();
  const refresh = useCallback(async ()=>{ setLoading(true); try{ setTemplates(await backend.list()); } finally { setLoading(false);} },[backend]);
  const load = useCallback(async (id:string)=>{ setLoading(true); try { setCurrent(await backend.get(id)); } finally { setLoading(false);} },[backend]);
  const save = useCallback(async (input:SaveTemplateInput)=>{ const rec = await backend.save(input); await refresh(); setCurrent(rec); return rec; },[backend,refresh]);
  const updateMeta = useCallback(async (input:UpdateTemplateMetaInput)=>{ const rec = await backend.updateMeta(input); await refresh(); if(rec && current?.id===rec.id) setCurrent(prev=> prev? {...prev, ...rec}: rec); return rec; },[backend,refresh,current]);
  const remove = useCallback(async (id:string)=>{ await backend.remove(id); await refresh(); if(current?.id===id) setCurrent(null); },[backend,current,refresh]);
  const clone = useCallback(async (id:string)=>{ const rec = await backend.clone(id); await refresh(); return rec; },[backend,refresh]);
  const sendTest = useCallback(async (id:string,email:string)=> backend.sendTest(id,email),[backend]);

  useEffect(()=>{ refresh(); },[refresh]);

  const visibleTemplates = templates.filter(t=>{
    if(filter && !(`${t.name} ${t.subject} ${t.tags.join(' ')}`.toLowerCase().includes(filter.toLowerCase()))) return false;
    if(tagFilter.length>0 && !tagFilter.every(tag=> t.tags.includes(tag))) return false;
    return true;
  });

  return { templates: visibleTemplates, current, loading, refresh, load, save, updateMeta, remove, clone, sendTest, setFilter, setTagFilter };
};

export default useTemplateManager;
