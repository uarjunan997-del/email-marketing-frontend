// Abstraction layer to switch between localStorage and REST backend based on env flag
import { TemplateRecord, TemplateMeta, SaveTemplateInput, UpdateTemplateMetaInput, TemplateVersion } from './templates';

export interface TemplatesBackend {
  list(): Promise<TemplateMeta[]>;
  get(id:string): Promise<TemplateRecord | null>;
  save(input: SaveTemplateInput & { html?: string }): Promise<TemplateRecord>;
  updateMeta(input: UpdateTemplateMetaInput): Promise<TemplateRecord | null>;
  remove(id:string): Promise<void>;
  clone(id:string): Promise<TemplateRecord | null>;
  sendTest(id:string,email:string): Promise<{ok:true}>;
}

// Local implementation just re-exports existing functions
import * as local from './templates';

class LocalBackend implements TemplatesBackend {
  list = local.listTemplates;
  get = local.getTemplate;
  save = local.saveTemplate as any;
  updateMeta = local.updateTemplateMeta;
  remove = local.deleteTemplate;
  clone = local.cloneTemplate;
  sendTest = local.sendTestTemplate;
}

class RestBackend implements TemplatesBackend {
  base = import.meta.env.VITE_API_BASE || '/api';
  async list(): Promise<TemplateMeta[]> { const r = await fetch(`${this.base}/templates`); return r.json(); }
  async get(id:string): Promise<TemplateRecord | null> { const r = await fetch(`${this.base}/templates/${id}`); if(r.status===404) return null; return r.json(); }
  async save(input: SaveTemplateInput & {html?:string}): Promise<TemplateRecord> {
    const method = input.id? 'PUT':'POST';
    const url = input.id? `${this.base}/templates/${input.id}` : `${this.base}/templates`;
    const r = await fetch(url,{method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(input)});
    if(!r.ok) throw new Error('Save failed');
    return r.json();
  }
  async updateMeta(input: UpdateTemplateMetaInput): Promise<TemplateRecord | null> {
    const r = await fetch(`${this.base}/templates/${input.id}`, {method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(input)});
    if(r.status===404) return null; if(!r.ok) throw new Error('Update failed'); return r.json();
  }
  async remove(id:string): Promise<void> { await fetch(`${this.base}/templates/${id}`, {method:'DELETE'}); }
  async clone(id:string): Promise<TemplateRecord | null> { const r = await fetch(`${this.base}/templates/${id}/clone`, {method:'POST'}); if(!r.ok) return null; return r.json(); }
  async sendTest(id:string,email:string): Promise<{ok:true}> { await fetch(`${this.base}/templates/${id}/send-test`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email})}); return {ok:true}; }
}

let backend: TemplatesBackend;
export const getTemplatesBackend = (): TemplatesBackend => {
  if(!backend){
    const mode = import.meta.env.VITE_TEMPLATES_BACKEND || 'local';
    backend = mode === 'rest' ? new RestBackend() : new LocalBackend();
  }
  return backend;
};

export type { TemplateRecord, TemplateMeta, SaveTemplateInput, UpdateTemplateMetaInput, TemplateVersion };