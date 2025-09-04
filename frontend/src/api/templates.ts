import { nanoid } from 'nanoid/non-secure';

export interface TemplateMeta {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  tags: string[];
  updatedAt: string; // ISO
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  thumbnail?: string; // base64 or data URL
}

export interface TemplateVersion {
  id: string; // version id
  createdAt: string; // ISO
  design: any;
  htmlSnippet?: string; // first chars of html for quick preview
}

export interface TemplateRecord extends TemplateMeta {
  design: any; // current design
  versions?: TemplateVersion[]; // history (latest first)
}

const STORAGE_KEY = 'emailTemplates';

const loadAll = (): TemplateRecord[] => {
  try {
    const raw: TemplateRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // migration: ensure versions array exists
    return raw.map(r => ({ ...r, versions: r.versions || [] }));
  } catch { return []; }
};
const persistAll = (list: TemplateRecord[]) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); };

export const listTemplates = async (): Promise<TemplateMeta[]> => {
  const list = loadAll();
  return list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(({design, ...meta})=>meta);
};

export const getTemplate = async (id:string): Promise<TemplateRecord | null> => {
  const list = loadAll();
  return list.find(t=>t.id===id) || null;
};

export interface SaveTemplateInput { id?: string; name: string; subject: string; preheader?: string; tags?: string[]; design: any; html?: string; }

export interface UpdateTemplateMetaInput { id: string; name?: string; subject?: string; preheader?: string; tags?: string[]; status?: TemplateMeta['status']; }

export const saveTemplate = async (input: SaveTemplateInput): Promise<TemplateRecord> => {
  const list = loadAll();
  let rec: TemplateRecord | undefined = input.id ? list.find(t=>t.id===input.id) : undefined;
  const now = new Date().toISOString();
  if(!rec){
    rec = { id: input.id || nanoid(10), status: 'DRAFT', updatedAt: now, name: input.name, subject: input.subject, preheader: input.preheader, tags: input.tags || [], design: input.design, versions: [] };
    list.push(rec);
  } else {
    rec.name = input.name; rec.subject = input.subject; rec.preheader = input.preheader; rec.tags = input.tags||[]; rec.design = input.design; rec.updatedAt = now;
  }
  // create a version entry (latest first)
  const version: TemplateVersion = { id: nanoid(8), createdAt: now, design: input.design, htmlSnippet: (input.html || '').slice(0, 500) };
  rec.versions = [version, ...(rec.versions||[])].slice(0, 25); // keep last 25 versions
  // naive thumbnail: store first 120 chars text-only
  rec.thumbnail = rec.thumbnail || (input.html ? toThumbnail(input.html) : undefined);
  persistAll(list);
  return rec;
};

export const updateTemplateMeta = async (input: UpdateTemplateMetaInput): Promise<TemplateRecord | null> => {
  const list = loadAll();
  const rec = list.find(t=>t.id===input.id);
  if(!rec) return null;
  if(input.name !== undefined) rec.name = input.name;
  if(input.subject !== undefined) rec.subject = input.subject;
  if(input.preheader !== undefined) rec.preheader = input.preheader;
  if(input.tags !== undefined) rec.tags = input.tags;
  if(input.status !== undefined) rec.status = input.status;
  rec.updatedAt = new Date().toISOString();
  persistAll(list);
  return rec;
};

const toThumbnail = (html:string): string => {
  // Fallback text summary; actual canvas capture can happen in UI layer (editor) and update meta later.
  try {
    const text = html.replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,120);
    return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)));
  } catch { return undefined as any; }
};

export const deleteTemplate = async (id:string): Promise<void> => {
  const list = loadAll().filter(t=>t.id!==id);
  persistAll(list);
};

export const cloneTemplate = async (id:string): Promise<TemplateRecord | null> => {
  const tpl = await getTemplate(id); if(!tpl) return null;
  return saveTemplate({ name: tpl.name + ' Copy', subject: tpl.subject, preheader: tpl.preheader, tags: tpl.tags, design: tpl.design });
};

export const sendTestTemplate = async (id:string, email:string): Promise<{ok:true}> => {
  console.log('Pretend sending test email', {id,email});
  await new Promise(r=>setTimeout(r,400));
  return {ok:true};
};
