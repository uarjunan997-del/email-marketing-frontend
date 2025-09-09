import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { AssetUpload } from '@api/ai';
import { 
  Upload, 
  Image, 
  X, 
  Move, 
  Eye,
  Download,
  Palette,
  Sparkles,
  Zap
} from 'lucide-react';
import { nanoid } from 'nanoid/non-secure';
import toast from 'react-hot-toast';

interface AssetUploadPanelProps {
  assets: AssetUpload[];
  onAssetsChange: (assets: AssetUpload[]) => void;
  onGenerateTemplate: () => void;
  loading?: boolean;
}

const assetTypes = [
  {
    type: 'logo' as const,
    label: 'Logo',
    description: 'Your brand logo for headers',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-primary-500 to-primary-600',
    maxFiles: 1
  },
  {
    type: 'background' as const,
    label: 'Background',
    description: 'Hero background images',
    icon: <Image className="w-5 h-5" />,
    color: 'from-secondary-500 to-secondary-600',
    maxFiles: 3
  },
  {
    type: 'content' as const,
    label: 'Content Images',
    description: 'Product photos, illustrations',
    icon: <Palette className="w-5 h-5" />,
    color: 'from-accent-500 to-accent-600',
    maxFiles: 10
  }
];

const DraggableAsset: React.FC<{
  asset: AssetUpload;
  index: number;
  onRemove: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}> = ({ asset, index, onRemove, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'asset',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'asset',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-move"
    >
      <Card variant="gradient" padding="sm" className="relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            icon={<X className="w-3 h-3" />}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
          />
        </div>
        
        <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-3">
          <img
            src={asset.preview}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm">
              {asset.type}
            </Badge>
            <Move className="w-3 h-3 text-neutral-400" />
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {asset.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {(asset.size / 1024).toFixed(1)} KB
            {asset.dimensions && ` • ${asset.dimensions.width}×${asset.dimensions.height}`}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

const AssetDropzone: React.FC<{
  assetType: typeof assetTypes[0];
  assets: AssetUpload[];
  onUpload: (files: File[], type: AssetUpload['type']) => void;
}> = ({ assetType, assets, onUpload }) => {
  const typeAssets = assets.filter(a => a.type === assetType.type);
  const canUploadMore = typeAssets.length < assetType.maxFiles;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles.slice(0, assetType.maxFiles - typeAssets.length), assetType.type);
    }
  }, [onUpload, assetType, typeAssets.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
    },
    multiple: assetType.maxFiles > 1,
    disabled: !canUploadMore,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${assetType.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {assetType.icon}
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {assetType.label}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {assetType.description}
          </p>
        </div>
        <Badge variant="outline" size="sm">
          {typeAssets.length}/{assetType.maxFiles}
        </Badge>
      </div>

      {canUploadMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 scale-105'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/10'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${assetType.color} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {isDragActive ? 'Drop files here' : `Upload ${assetType.label}`}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                PNG, JPG, SVG up to 10MB
              </p>
            </div>
          </div>
        </div>
      )}

      {typeAssets.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {typeAssets.map((asset, index) => (
            <DraggableAsset
              key={asset.id}
              asset={asset}
              index={index}
              onRemove={() => {
                const newAssets = assets.filter(a => a.id !== asset.id);
                onUpload([], assetType.type); // Trigger parent update
              }}
              onMove={() => {}} // Implement if needed
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AssetUploadPanel: React.FC<AssetUploadPanelProps> = ({
  assets,
  onAssetsChange,
  onGenerateTemplate,
  loading
}) => {
  const handleAssetUpload = useCallback(async (files: File[], type: AssetUpload['type']) => {
    const newAssets: AssetUpload[] = [];
    
    for (const file of files) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      
      // Get dimensions for images
      let dimensions: { width: number; height: number } | undefined;
      if (file.type.startsWith('image/')) {
        try {
          dimensions = await getImageDimensions(file);
        } catch (error) {
          console.warn('Could not get image dimensions:', error);
        }
      }

      const asset: AssetUpload = {
        id: nanoid(),
        name: file.name,
        type,
        file,
        preview,
        dimensions,
        size: file.size
      };

      newAssets.push(asset);
    }

    if (newAssets.length > 0) {
      onAssetsChange([...assets, ...newAssets]);
      toast.success(`${newAssets.length} asset(s) uploaded successfully!`);
    }
  }, [assets, onAssetsChange]);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const totalAssets = assets.length;
  const assetsByType = {
    logo: assets.filter(a => a.type === 'logo').length,
    background: assets.filter(a => a.type === 'background').length,
    content: assets.filter(a => a.type === 'content').length
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2">
            Upload Your Brand Assets
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Upload your logo, background images, and content assets. Our AI will create stunning email templates using your brand elements.
          </p>
        </motion.div>

        {/* Asset Summary */}
        {totalAssets > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card variant="gradient" className="text-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {assetsByType.logo}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Logos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                    {assetsByType.background}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Backgrounds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {assetsByType.content}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Content</div>
                </div>
              </div>
              <Button
                onClick={onGenerateTemplate}
                disabled={totalAssets === 0 || loading}
                loading={loading}
                size="lg"
                icon={<Sparkles className="w-4 h-4" />}
                className="px-8"
              >
                Generate Template with Assets
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Asset Upload Zones */}
        <div className="space-y-8">
          {assetTypes.map((assetType, index) => (
            <motion.div
              key={assetType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card variant="glass" padding="lg">
                <AssetDropzone
                  assetType={assetType}
                  assets={assets}
                  onUpload={handleAssetUpload}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Asset Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card variant="glass" padding="md">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-500" />
              Asset Guidelines
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Recommended Formats
                </h5>
                <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• PNG with transparency for logos</li>
                  <li>• JPG for photographs and backgrounds</li>
                  <li>• SVG for scalable graphics</li>
                  <li>• WebP for optimized file sizes</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Size Recommendations
                </h5>
                <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• Logo: 200×80px (transparent background)</li>
                  <li>• Background: 1200×600px minimum</li>
                  <li>• Content images: 600×400px optimal</li>
                  <li>• Maximum file size: 10MB each</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DndProvider>
  );
};

export default AssetUploadPanel;