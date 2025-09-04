import React, { useMemo } from 'react';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { TemplateMeta } from '@api/templates';

export interface TemplateGalleryProps {
  templates: TemplateMeta[];
  loading?: boolean;
  onCreate: () => void;
  onEdit: (id:string) => void;
  onClone: (id:string) => void;
  onDelete: (id:string) => void;
  onSearch?: (q:string)=>void;
  onTagFilterChange?: (tags:string[])=>void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({templates, loading, onCreate, onEdit, onClone, onDelete, onSearch, onTagFilterChange}) => {
  const allTags = useMemo(()=> Array.from(new Set(templates.flatMap(t=>t.tags))).sort(),[templates]);
  const handleToggleTag = (tag:string) => {
    if(!onTagFilterChange) return;
    // compute new selection by reading from data-selected attribute on container (not ideal but stateless component)
    // Consumers will manage state; here we just emit selected tags appended/removed.
    // To keep stateless, we rely on a hidden input list? Simpler: not track, just emit single tag selection toggle event requiring parent to maintain state.
    // We'll just call onTagFilterChange with [tag] to indicate focusing on one tag; multi-select handled externally if desired.
    onTagFilterChange([tag]);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Templates</h2>
        <Button onClick={onCreate}>New Template</Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <input placeholder="Search templates..." className="max-w-xs flex-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-sm" onChange={e=>onSearch?.(e.target.value)} />
        {allTags.length>0 && <div className="flex gap-1 flex-wrap">
          {allTags.map(tag=> <button key={tag} onClick={()=>handleToggleTag(tag)} className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs hover:bg-primary-500 hover:text-white transition">#{tag}</button>)}
        </div>}
      </div>
      {loading && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse" />)}</div>}
      {!loading && templates.length===0 && <p className="text-sm text-gray-500">No templates yet.</p>}
      {!loading && templates.length>0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(t=> (
            <div key={t.id} className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-1" title={t.name}>{t.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={t.subject}>{t.subject}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.slice(0,3).map(tag=> <Badge key={tag} variant="info">{tag}</Badge>)}
                </div>
              </div>
              <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" onClick={()=>onEdit(t.id)}>Edit</Button>
                <Button variant="ghost" onClick={()=>onClone(t.id)}>Clone</Button>
                <Button variant="ghost" onClick={()=>onDelete(t.id)}>Delete</Button>
              </div>
              <div className="absolute top-2 right-2"><Badge variant={t.status==='ACTIVE'?'success': t.status==='ARCHIVED'?'warning':'default'}>{t.status}</Badge></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
