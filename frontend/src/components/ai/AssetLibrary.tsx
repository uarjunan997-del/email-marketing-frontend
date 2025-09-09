import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { AssetUpload } from '@api/ai';
import { 
  Image, 
  Trash2, 
  Edit, 
  Eye, 
  Move,
  Grid3X3,
  List,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface AssetLibraryProps {
  assets: AssetUpload[];
  onAssetsChange: (assets: AssetUpload[]) => void;
  onAssetSelect?: (asset: AssetUpload) => void;
  selectable?: boolean;
  viewMode?: 'grid' | 'list';
}

const DraggableAssetCard: React.FC<{
  asset: AssetUpload;
  index: number;
  onRemove: () => void;
  onSelect?: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  selectable?: boolean;
}> = ({ asset, index, onRemove, onSelect, onMove, selectable }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'library-asset',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'library-asset',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const getTypeColor = (type: AssetUpload['type']) => {
    switch (type) {
      case 'logo': return 'from-primary-500 to-primary-600';
      case 'background': return 'from-secondary-500 to-secondary-600';
      case 'content': return 'from-accent-500 to-accent-600';
      default: return 'from-neutral-500 to-neutral-600';
    }
  };

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-move"
    >
      <Card 
        variant="gradient" 
        padding="sm" 
        className={`relative overflow-hidden transition-all duration-300 ${
          selectable ? 'cursor-pointer hover:ring-2 hover:ring-primary-500' : ''
        }`}
        onClick={selectable ? onSelect : undefined}
      >
        {/* Asset Type Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge 
            variant="gradient" 
            size="sm"
            className={`bg-gradient-to-r ${getTypeColor(asset.type)} text-white`}
          >
            {asset.type}
          </Badge>
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye className="w-3 h-3" />}
              className="bg-white/90 hover:bg-white text-neutral-900 rounded-full w-6 h-6 p-0"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              icon={<Trash2 className="w-3 h-3" />}
              className="bg-red-500/90 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
            />
          </div>
        </div>

        {/* Asset Preview */}
        <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-3 relative">
          <img
            src={asset.preview}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Asset Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Move className="w-3 h-3 text-neutral-400" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Drag to reorder
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate" title={asset.name}>
            {asset.name}
          </p>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>{(asset.size / 1024).toFixed(1)} KB</span>
            {asset.dimensions && (
              <span>{asset.dimensions.width}×{asset.dimensions.height}</span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  onAssetsChange,
  onAssetSelect,
  selectable = false,
  viewMode = 'grid'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetUpload['type'] | 'all'>('all');

  const moveAsset = useCallback((dragIndex: number, hoverIndex: number) => {
    const newAssets = [...assets];
    const draggedAsset = newAssets[dragIndex];
    newAssets.splice(dragIndex, 1);
    newAssets.splice(hoverIndex, 0, draggedAsset);
    onAssetsChange(newAssets);
  }, [assets, onAssetsChange]);

  const removeAsset = useCallback((assetId: string) => {
    const newAssets = assets.filter(a => a.id !== assetId);
    onAssetsChange(newAssets);
  }, [assets, onAssetsChange]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const assetCounts = {
    all: assets.length,
    logo: assets.filter(a => a.type === 'logo').length,
    background: assets.filter(a => a.type === 'background').length,
    content: assets.filter(a => a.type === 'content').length
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              Asset Library
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage and organize your brand assets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
              Export All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm focus-ring"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-500" />
              {(['all', 'logo', 'background', 'content'] as const).map(type => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    typeFilter === type
                      ? 'bg-primary-500 text-white shadow-glow'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                  }`}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  <Badge variant="outline" size="sm" className="ml-1">
                    {assetCounts[type]}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>
        </Card>

        {/* Assets Grid */}
        <AnimatePresence>
          {filteredAssets.length > 0 ? (
            <motion.div
              key="assets-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredAssets.map((asset, index) => (
                <DraggableAssetCard
                  key={asset.id}
                  asset={asset}
                  index={index}
                  onRemove={() => removeAsset(asset.id)}
                  onSelect={onAssetSelect ? () => onAssetSelect(asset) : undefined}
                  onMove={moveAsset}
                  selectable={selectable}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Image className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="font-display font-semibold text-xl text-neutral-900 dark:text-neutral-100 mb-2">
                No assets found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {searchQuery || typeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Upload some assets to get started with AI template generation'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

export default AssetLibrary;