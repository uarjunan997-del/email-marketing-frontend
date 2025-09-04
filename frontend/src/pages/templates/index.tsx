import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateGallery } from '@components/TemplateGallery/TemplateGallery';
import { useTemplateManager } from '@hooks/useTemplateManager';

const TemplateGalleryPage: React.FC = () => {
  const { templates, loading, clone, remove, setFilter, setTagFilter } = useTemplateManager();
  const [selectedTags,setSelectedTags] = useState<string[]>([]);
  const handleTagFilter = (tags:string[]) => { setSelectedTags(tags); setTagFilter(tags); };
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <TemplateGallery
        templates={templates}
        loading={loading}
        onCreate={()=>navigate('/templates/new')}
        onEdit={(id)=>navigate(`/templates/${id}`)}
        onClone={async (id)=>{ const rec = await clone(id); if(rec) navigate(`/templates/${rec.id}`); }}
        onDelete={async (id)=>{ if(confirm('Delete template?')) await remove(id); }}
        onSearch={(q)=>setFilter(q)}
        onTagFilterChange={handleTagFilter}
      />
    </div>
  );
};

export default TemplateGalleryPage;
