import React, { useEffect, useRef, useState, useCallback } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-newsletter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { Modal } from '@components/ui/Modal';
import { AssetUpload } from '@api/ai';
import { 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Settings,
  Palette,
  Type,
  Image,
  Layers,
  Code,
  Download
} from 'lucide-react';

interface EnhancedGrapesEditorProps {
  initialHtml?: string;
  initialCss?: string;
  assets?: AssetUpload[];
  onSave: (html: string, css: string) => void;
  onPreview?: (html: string, css: string) => void;
  loading?: boolean;
}

export const EnhancedGrapesEditor: React.FC<EnhancedGrapesEditorProps> = ({
  initialHtml,
  initialCss,
  assets = [],
  onSave,
  onPreview,
  loading
}) => {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAssetPanel, setShowAssetPanel] = useState(true);
  const [showCodeView, setShowCodeView] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      height: '100%',
      width: '100%',
      fromElement: false,
      storageManager: false,
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          inlineCss: true,
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function(editor: Editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          }
        }
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ]
      },
      assetManager: {
        assets: assets.map(asset => ({
          type: 'image',
          src: asset.preview,
          name: asset.name,
          category: asset.type
        }))
      }
    });

    // Add custom asset blocks
    const blockManager = editor.BlockManager;
    
    // Logo block
    blockManager.add('logo-header', {
      label: 'Logo Header',
      category: 'Brand Assets',
      content: `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
          <img src="{{logo}}" alt="Logo" style="max-height: 60px; width: auto;" />
        </div>
      `,
      attributes: { class: 'gjs-fonts gjs-f-header' }
    });

    // Hero with background
    blockManager.add('hero-background', {
      label: 'Hero Background',
      category: 'Brand Assets',
      content: `
        <div style="background-image: url('{{background}}'); background-size: cover; background-position: center; padding: 80px 20px; text-align: center; color: white; position: relative;">
          <div style="background: rgba(0,0,0,0.4); padding: 40px; border-radius: 12px; display: inline-block;">
            <h1 style="font-size: 32px; margin: 0 0 16px 0; font-weight: bold;">Your Headline Here</h1>
            <p style="font-size: 18px; margin: 0 0 24px 0; opacity: 0.9;">Compelling subheadline text</p>
            <a href="#" style="background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Call to Action</a>
          </div>
        </div>
      `,
      attributes: { class: 'gjs-fonts gjs-f-hero' }
    });

    // Content image gallery
    blockManager.add('image-gallery', {
      label: 'Image Gallery',
      category: 'Brand Assets',
      content: `
        <div style="padding: 40px 20px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            ${assets.filter(a => a.type === 'content').slice(0, 4).map(asset => `
              <div style="text-align: center;">
                <img src="${asset.preview}" alt="${asset.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />
                <h3 style="font-size: 16px; margin: 0; color: #1e293b;">Product Name</h3>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      attributes: { class: 'gjs-fonts gjs-f-gallery' }
    });

    // Custom variable blocks
    const variables = [
      { name: 'first_name', label: 'First Name' },
      { name: 'last_name', label: 'Last Name' },
      { name: 'company_name', label: 'Company' },
      { name: 'unsubscribe_url', label: 'Unsubscribe Link' }
    ];

    variables.forEach(variable => {
      blockManager.add(`var-${variable.name}`, {
        label: variable.label,
        category: 'Variables',
        content: `<span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #6366f1;">{{${variable.name}}}</span>`,
        attributes: { class: 'gjs-fonts gjs-f-text' }
      });
    });

    // Load initial content
    if (initialHtml) {
      editor.setComponents(initialHtml);
    }
    if (initialCss) {
      editor.setStyle(initialCss);
    }

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [initialHtml, initialCss, assets]);

  const handleSave = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    
    onSave(html, css);
  }, [onSave]);

  const handlePreview = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    
    setHtmlCode(html);
    setCssCode(css);
    
    if (onPreview) {
      onPreview(html, css);
    }
    setPreviewMode(true);
  }, [onPreview]);

  const handleCodeView = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    
    setHtmlCode(html);
    setCssCode(css);
    setShowCodeView(true);
  }, []);

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Template Editor
            </span>
          </div>
          
          {assets.length > 0 && (
            <Badge variant="accent" className="flex items-center gap-1">
              <Image className="w-3 h-3" />
              {assets.length} Asset{assets.length > 1 ? 's' : ''} Available
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Device Preview Buttons */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            {Object.entries(deviceWidths).map(([device, width]) => (
              <Button
                key={device}
                variant={previewDevice === device ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice(device as any)}
                icon={
                  device === 'desktop' ? <Monitor className="w-4 h-4" /> :
                  device === 'tablet' ? <Tablet className="w-4 h-4" /> :
                  <Smartphone className="w-4 h-4" />
                }
              >
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowAssetPanel(!showAssetPanel)}
            icon={<Layers className="w-4 h-4" />}
          >
            Assets
          </Button>

          <Button
            variant="ghost"
            onClick={handleCodeView}
            icon={<Code className="w-4 h-4" />}
          >
            Code
          </Button>

          <Button
            variant="outline"
            onClick={handlePreview}
            icon={<Eye className="w-4 h-4" />}
          >
            Preview
          </Button>

          <Button
            onClick={handleSave}
            loading={loading}
            icon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
        </div>
      </motion.div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Asset Panel */}
        <AnimatePresence>
          {showAssetPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-hidden"
            >
              <div className="p-4 h-full overflow-y-auto">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-500" />
                  Brand Assets
                </h3>
                
                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card variant="glass" padding="sm" className="cursor-pointer hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden mb-2">
                          <img
                            src={asset.preview}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/html', `<img src="${asset.preview}" alt="${asset.name}" style="max-width: 100%; height: auto;" />`);
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" size="sm">
                              {asset.type}
                            </Badge>
                            <span className="text-xs text-neutral-500">
                              {(asset.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {asset.name}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {assets.length === 0 && (
                    <div className="text-center py-8">
                      <Image className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm text-neutral-500">
                        No assets uploaded yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Canvas */}
        <div className="flex-1 relative">
          <div 
            ref={containerRef} 
            className="h-full w-full"
            style={{ 
              maxWidth: previewDevice === 'mobile' ? '375px' : 
                       previewDevice === 'tablet' ? '768px' : '100%',
              margin: previewDevice !== 'desktop' ? '0 auto' : '0'
            }}
          />
        </div>
      </div>

      {/* Code View Modal */}
      <Modal 
        open={showCodeView} 
        onClose={() => setShowCodeView(false)} 
        title="Template Code"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">HTML</h4>
            <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm overflow-auto max-h-60">
              <code>{htmlCode}</code>
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">CSS</h4>
            <pre className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm overflow-auto max-h-60">
              <code>{cssCode}</code>
            </pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={() => {
                const blob = new Blob([htmlCode + '<style>' + cssCode + '</style>'], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'template.html';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download HTML
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedGrapesEditor;