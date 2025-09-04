import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplateManager } from '@hooks/useTemplateManager';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { Input } from '@components/atoms/Input';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye,
  Calendar,
  Tag
} from 'lucide-react';

const TemplateGalleryPage: React.FC = () => {
  const { templates, loading, clone, remove, setFilter, setTagFilter } = useTemplateManager();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const allTags = Array.from(new Set(templates.flatMap(t => t.tags))).sort();

  const handleTagFilter = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setTagFilter(newTags);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter(query);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
            Email Templates
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Create, manage, and organize your email templates
          </p>
        </div>
        <Button
          onClick={() => navigate('/templates/new')}
          icon={<Plus className="w-4 h-4" />}
          size="lg"
        >
          New Template
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card variant="glass" padding="md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                icon={<Search className="w-4 h-4" />}
                variant="floating"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  Filter by tags:
                </span>
                {allTags.map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                    }`}
                  >
                    #{tag}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Templates grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-64 shimmer" />
            ))}
          </motion.div>
        ) : templates.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-primary-500" />
            </div>
            <h3 className="font-display font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-2">
              No templates yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Get started by creating your first email template. Choose from our library of beautiful designs or start from scratch.
            </p>
            <Button
              onClick={() => navigate('/templates/new')}
              icon={<Plus className="w-4 h-4" />}
              size="lg"
            >
              Create Your First Template
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="templates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card hover variant="gradient" className="group relative overflow-hidden">
                  {/* Status badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      variant={
                        template.status === 'ACTIVE' ? 'success' : 
                        template.status === 'ARCHIVED' ? 'warning' : 
                        'default'
                      }
                    >
                      {template.status}
                    </Badge>
                  </div>

                  {/* Template preview area */}
                  <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
                    <Eye className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
                    
                    {/* Hover overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/templates/${template.id}`)}
                        className="bg-white/90 text-neutral-900 hover:bg-white"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </motion.div>
                  </div>

                  {/* Template info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1" title={template.name}>
                        {template.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1" title={template.subject}>
                        {template.subject}
                      </p>
                    </div>

                    {/* Tags */}
                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="info" size="sm">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="default" size="sm">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Last updated */}
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/templates/${template.id}`)}
                        icon={<Edit3 className="w-3 h-3" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const cloned = await clone(template.id);
                          if (cloned) navigate(`/templates/${cloned.id}`);
                        }}
                        icon={<Copy className="w-3 h-3" />}
                      >
                        Clone
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this template?')) {
                            remove(template.id);
                          }
                        }}
                        icon={<Trash2 className="w-3 h-3" />}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateGalleryPage;