import { apiCall, api } from '../utils/api';

export interface Contact { 
  id: number; 
  email: string; 
  firstName?: string; 
  lastName?: string; 
  segment?: string | null; 
  unsubscribed?: boolean;
  suppressed?: boolean;
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
  totalRows?: number;
  processedRows?: number;
  failedRows?: number;
  status: 'CREATED'|'PENDING'|'READY_FOR_PROCESSING'|'RUNNING'|'COMPLETED'|'FAILED';
  dedupeStrategy?: 'MERGE'|'SKIP'|'OVERWRITE';
  createdAt?: string;
  userId?: number;
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

export interface CustomField {
  id: number;
  fieldKey: string;
  label: string;
  dataType: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'DROPDOWN';
  required?: boolean;
  options?: string[];
  createdAt?: string;
}

export interface SuppressionEntry {
  id: number;
  email: string;
  reason: 'HARD_BOUNCE' | 'SPAM_COMPLAINT' | 'UNSUBSCRIBED' | 'INVALID_EMAIL' | 'MANUAL';
  createdAt: string;
}

export interface GDPRRequest {
  id: number;
  email: string;
  requestType: 'EXPORT' | 'DELETE';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
}

export interface Segment {
  name: string;
  value: string;
  count: number;
}

// Contact CRUD operations
export const listContacts = (params?: { 
  segment?: string; 
  search?: string; 
  page?: number; 
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const searchParams = new URLSearchParams();
  if (params?.segment && params.segment !== 'all') searchParams.append('segment', params.segment);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiCall<{ contacts: Contact[]; total: number; page: number; totalPages: number }>('GET', `/contacts${qs}`);
};

export const getContact = (id: number) => apiCall<Contact>('GET', `/contacts/${id}`);

export const createContact = (body: { 
  email: string; 
  firstName?: string; 
  lastName?: string; 
  segment?: string | null;
  phone?: string;
  country?: string;
  city?: string;
  customFields?: Record<string, any>;
}) => apiCall<Contact>('POST', '/contacts', body);

export const updateContact = (id: number, body: Partial<Contact>) => 
  apiCall<Contact>('PUT', `/contacts/${id}`, body);

export const deleteContact = (id: number, erase = false) => 
  apiCall<void>('DELETE', `/contacts/${id}?erase=${erase}`);

export const bulkDeleteContacts = (ids: number[], erase = false) =>
  apiCall<void>('DELETE', '/contacts/bulk', { ids, erase });

export const bulkUpdateContacts = (ids: number[], updates: Partial<Contact>) =>
  apiCall<void>('PUT', '/contacts/bulk', { ids, updates });

// Segments
export const listSegments = async (): Promise<Segment[]> => {
  try {
    const response = await listContacts();
    const contacts = response.contacts || [];
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
  } catch (error) {
    console.error('Failed to load segments:', error);
    return [{ name: 'All Subscribers', value: 'all', count: 0 }];
  }
};

// Import operations
export const createImportJob = (body: { 
  mapping?: string; 
  dedupeStrategy?: 'MERGE'|'SKIP'|'OVERWRITE'; 
  filename?: string; 
}) => apiCall<ImportJob>('POST', '/contacts/bulk', body);

export const uploadImport = async (file: File, mapping?: string, dedupeStrategy?: string) => {
  const form = new FormData();
  form.append('file', file);
  if (mapping) form.append('mapping', mapping);
  if (dedupeStrategy) form.append('dedupeStrategy', dedupeStrategy);

  const res = await api.request({
    method: 'POST',
    url: '/contacts/import',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const listImportJobs = () => apiCall<ImportJob[]>('GET', '/contacts/imports');
export const getImportJob = (jobId: number) => apiCall<ImportJob>('GET', `/contacts/imports/${jobId}`);
export const getImportErrors = (jobId: number) => apiCall<any[]>('GET', `/contacts/imports/${jobId}/errors`);
export const getImportProgress = (jobId: number) => apiCall<ImportJob>('GET', `/contacts/imports/${jobId}/progress`);

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

export const previewContactList = (listId: number) => 
  apiCall<{ count: number; sample: Contact[] }>('GET', `/contacts/lists/${listId}/preview`);

export const materializeContactList = (listId: number) => 
  apiCall<{ inserted: number }>('POST', `/contacts/lists/${listId}/materialize`);

export const addMembersToList = (listId: number, emails: string[]) =>
  apiCall<void>('POST', `/contacts/lists/${listId}/members`, { emails });

export const removeMembersFromList = (listId: number, emails: string[]) =>
  apiCall<void>('DELETE', `/contacts/lists/${listId}/members`, { emails });

// Suppression management
export const listSuppression = () => apiCall<SuppressionEntry[]>('GET', '/contacts/suppression');

export const suppressEmails = (emails: string[], reason?: string) => 
  apiCall<void>('POST', '/contacts/suppression', { emails, reason });

export const unsuppressEmail = (email: string) => 
  apiCall<void>('DELETE', `/contacts/suppression?email=${encodeURIComponent(email)}`);

// Custom fields
export const listCustomFields = () => apiCall<CustomField[]>('GET', '/contacts/custom-fields');

export const createCustomField = (body: {
  fieldKey: string; 
  label: string; 
  dataType: CustomField['dataType'];
  required?: boolean;
  options?: string[];
}) => apiCall<CustomField>('POST', '/contacts/custom-fields', body);

export const updateCustomField = (id: number, body: Partial<CustomField>) => 
  apiCall<CustomField>('PUT', `/contacts/custom-fields/${id}`, body);

export const deleteCustomField = (id: number) => 
  apiCall<void>('DELETE', `/contacts/custom-fields/${id}`);

export const setContactCustomFields = (id: number, customFields: Record<string, any>) => 
  apiCall<Contact>('PUT', `/contacts/${id}/custom-fields`, { customFields });

// GDPR operations
export const listGDPRRequests = () => apiCall<GDPRRequest[]>('GET', '/contacts/gdpr/requests');

export const createGDPRRequest = (email: string, requestType: 'EXPORT' | 'DELETE') =>
  apiCall<GDPRRequest>('POST', '/contacts/gdpr/requests', { email, requestType });

export const exportContactData = (email: string) =>
  apiCall<any>('GET', `/contacts/gdpr/export?email=${encodeURIComponent(email)}`);

export const purgeContactData = (email: string) =>
  apiCall<void>('DELETE', `/contacts/gdpr/purge?email=${encodeURIComponent(email)}`);

// Export
export const exportContactsCsv = (params?: { segment?: string; format?: string }) => {
  const token = localStorage.getItem('token');
  const searchParams = new URLSearchParams();
  if (params?.segment) searchParams.append('segment', params.segment);
  if (params?.format) searchParams.append('format', params.format);
  
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : '?format=csv';
  
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/export${qs}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// Contact activity
export const getContactActivity = (id: number) => 
  apiCall<any[]>('GET', `/contacts/${id}/activity`);