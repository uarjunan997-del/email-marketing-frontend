import { apiCall } from '../utils/api';

export interface Contact { 
  id: number; 
  email: string; 
  firstName?: string; 
  lastName?: string; 
  segment?: string | null; 
  unsubscribed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  country?: string;
  city?: string;
  customFields?: Record<string, any>;
}

export interface ImportJob {
  id: number;
  filename: string;
  total_rows?: number;
  processed_rows?: number;
  failed_rows?: number;
  status: 'CREATED'|'PENDING'|'READY_FOR_PROCESSING'|'RUNNING'|'COMPLETED'|'FAILED';
  dedupe_strategy?: 'MERGE'|'SKIP'|'OVERWRITE';
  createdAt?: string;
}

export interface ContactList {
  id: number;
  name: string;
  description?: string;
  isDynamic?: boolean;
  dynamicQuery?: string;
  memberCount?: number;
  createdAt?: string;
}

export interface Segment {
  name: string;
  value: string;
  count: number;
}

// Contact CRUD operations
export const listContacts = (segment?: string, search?: string) => {
  const params = new URLSearchParams();
  if (segment && segment !== 'all') params.append('segment', segment);
  if (search) params.append('search', search);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiCall<Contact[]>('GET', `/contacts${qs}`);
};

export const createContact = (body: { 
  email: string; 
  firstName?: string; 
  lastName?: string; 
  segment?: string | null;
  phone?: string;
  country?: string;
  city?: string;
}) => apiCall<Contact>('POST', '/contacts', body);

export const updateContact = (id: number, body: Partial<Contact>) => 
  apiCall<Contact>('PUT', `/contacts/${id}`, body);

export const deleteContact = (id: number, erase = false) => 
  apiCall<void>('DELETE', `/contacts/${id}?erase=${erase}`);

export const bulkDeleteContacts = (ids: number[], erase = false) =>
  apiCall<void>('DELETE', '/contacts/bulk', { ids, erase });

// Derive available segments from contacts
export const listSegments = async (): Promise<Segment[]> => {
  const contacts = await listContacts();
  const segmentCounts: Record<string, number> = {};
  let total = 0;
  
  contacts.forEach((c: Contact) => {
    total++;
    if (c.segment) { 
      segmentCounts[c.segment] = (segmentCounts[c.segment] || 0) + 1; 
    }
  });
  
  return [
    { name: 'All Subscribers', value: 'all', count: total },
    ...Object.entries(segmentCounts).map(([seg, count]) => ({ 
      name: seg, 
      value: seg, 
      count 
    }))
  ];
};

// Import operations
export const createImportJob = (body: { 
  mapping?: string; 
  dedupe_strategy?: 'MERGE'|'SKIP'|'OVERWRITE'; 
  filename?: string; 
}) => apiCall<ImportJob>('POST', '/contacts/bulk', body);

export const uploadImport = async (file: File, mapping?: string) => {
  const form = new FormData();
  form.append('file', file);
  if (mapping) form.append('mapping', mapping);
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: form
  });
  
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
};

export const listImportJobs = () => apiCall<ImportJob[]>('GET', '/contacts/imports');
export const getImportJob = (jobId: number) => apiCall<ImportJob>('GET', `/contacts/imports/${jobId}`);
export const getImportErrors = (jobId: number) => apiCall<any[]>('GET', `/contacts/imports/${jobId}/errors`);

// Lists/Segments operations
export const listContactLists = () => apiCall<ContactList[]>('GET', '/contacts/lists');
export const createContactList = (body: {
  name: string; 
  description?: string; 
  isDynamic?: boolean; 
  dynamicQuery?: string; 
}) => apiCall<ContactList>('POST', '/contacts/lists', body);

export const updateContactList = (listId: number, body: Partial<ContactList>) => 
  apiCall<ContactList>('PUT', `/contacts/lists/${listId}`, body);

export const deleteContactList = (listId: number) => 
  apiCall<void>('DELETE', `/contacts/lists/${listId}`);

// Export
export const exportContactsCsv = () => {
  const token = localStorage.getItem('token');
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/export?format=csv`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};