import { api } from '../utils/api';

export interface AssetUpload {
  id: string;
  name: string;
  type: 'logo' | 'background' | 'content';
  file: File;
  preview: string;
  dimensions?: { width: number; height: number };
  size: number;
}

export interface GenerateTemplateRequest {
  prompt: string;
  templateType: 'newsletter' | 'promotional' | 'welcome' | 'transactional';
  assets: AssetUpload[];
  brandColors?: string[];
  style?: 'modern' | 'classic' | 'minimal' | 'bold';
}

export interface GeneratedTemplate {
  id: string;
  html: string;
  css: string;
  previewImage: string;
  assetUrls: Record<string, string>;
  metadata: {
    title: string;
    description: string;
    usedAssets: string[];
  };
}

export interface AITemplateResponse {
  template: GeneratedTemplate;
  suggestions: string[];
  processingTime: number;
}

export const generateTemplateWithAssets = async (request: GenerateTemplateRequest): Promise<AITemplateResponse> => {
  const formData = new FormData();
  
  // Add prompt and metadata
  formData.append('prompt', request.prompt);
  formData.append('templateType', request.templateType);
  formData.append('style', request.style || 'modern');
  
  if (request.brandColors) {
    formData.append('brandColors', JSON.stringify(request.brandColors));
  }

  // Add assets
  request.assets.forEach((asset, index) => {
    formData.append(`assets[${index}]`, asset.file);
    formData.append(`assetTypes[${index}]`, asset.type);
    formData.append(`assetNames[${index}]`, asset.name);
  });

  const response = await api.post('/api/ai/generate-template-with-assets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 seconds for AI processing
  });

  return response.data;
};

export const getAssetSuggestions = async (assets: AssetUpload[]): Promise<string[]> => {
  const response = await api.post('/api/ai/asset-suggestions', {
    assets: assets.map(a => ({
      type: a.type,
      name: a.name,
      dimensions: a.dimensions
    }))
  });
  
  return response.data.suggestions;
};

export const optimizeAssetForEmail = async (file: File): Promise<{ optimizedUrl: string; dimensions: { width: number; height: number } }> => {
  const formData = new FormData();
  formData.append('asset', file);
  
  const response = await api.post('/api/assets/optimize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  
  return response.data;
};