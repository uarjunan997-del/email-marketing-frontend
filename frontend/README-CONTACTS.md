# Contacts Feature: Frontend + Backend Integration Guide

This guide explains how to build the Contacts UI in the frontend and wire it to the backend endpoints. It covers CRUD, import pipeline, dynamic lists (segments), suppression, GDPR tools, custom fields, exports, and real‑time import job progress.

## Overview
- Frontend stack: React + Vite + TypeScript + Tailwind. Axios wrapper in `src/utils/api.ts` with JWT auth.
- Backend endpoints base: `${VITE_API_BASE_URL}` with path prefix `/contacts`.
- Auth: Bearer token via interceptor (already configured).
- WebSocket: STOMP over SockJS at `/ws`, subscribe to `/topic/imports/{userId}` for import job progress.

## UI Scope (recommended pages/components)
- Contacts List page
  - Table of contacts; filter by segment; search later.
  - Actions: create, edit, soft-delete (unsub), hard delete (purge under GDPR tab).
- Import page
  - Upload CSV; optional mapping JSON; show progress in real time.
  - Show errors table (failed rows).
- Lists (Segments) page
  - CRUD lists; dynamic lists with live preview and materialize.
- Suppression list page
  - View/add/remove suppressed emails with reasons.
- Custom Fields page
  - CRUD custom field metadata; set fields on contact.
- Contact Activity drawer/panel
  - Show last 100 activities for a contact.

Suggested routes under `/contacts/*`:
- `/contacts` → list
- `/contacts/import` → upload & progress
- `/contacts/lists` → lists overview
- `/contacts/suppression` → suppression
- `/contacts/custom-fields` → fields
- `/contacts/:id` → detail (optional)

## Data Shapes (frontend)
Minimal Contact:
```
interface Contact {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  segment?: string | null;
  unsubscribed?: boolean;
}
```

Import Job (backend response excerpt):
```
interface ImportJob {
  id: number;
  filename: string;
  total_rows?: number;
  processed_rows?: number;
  failed_rows?: number;
  status: 'CREATED'|'PENDING'|'READY_FOR_PROCESSING'|'RUNNING'|'COMPLETED'|'FAILED';
  dedupe_strategy?: 'MERGE'|'SKIP'|'OVERWRITE';
}
```

## Frontend API wrappers (extend `src/api/contacts.ts`)
Add functions for backend endpoints (example signatures):
```
import { apiCall } from '../utils/api';

export const listContacts = (segment?: string) => apiCall<Contact[]>('GET', `/contacts${segment?`?segment=${encodeURIComponent(segment)}`:''}`);
export const createContact = (body: { email:string; firstName?:string; lastName?:string; segment?:string|null; }) => apiCall<Contact>('POST','/contacts', body);
export const updateContact = (id:number, body: { email:string; firstName?:string; lastName?:string; segment?:string|null; }) => apiCall<Contact>('PUT',`/contacts/${id}`, body);
export const deleteContact = (id:number, erase=false) => apiCall<void>('DELETE',`/contacts/${id}?erase=${erase}`);

export const requestDelete = (id:number) => apiCall('POST', `/contacts/${id}/request-delete`);
export const purgeContact = (id:number) => apiCall('DELETE', `/contacts/${id}/purge`);

export const createImportJob = (body: { mapping?: string; dedupe_strategy?: 'MERGE'|'SKIP'|'OVERWRITE'; filename?:string; }) => apiCall('POST','/contacts/bulk', body);
export const uploadImport = (file:File, mapping?:string) => {
  const form = new FormData(); form.append('file', file); if(mapping) form.append('mapping', mapping);
  return api.request({ method:'POST', url:'/contacts/import', data:form, headers:{'Content-Type':'multipart/form-data'} }).then(r=>r.data);
};
export const listImportJobs = () => apiCall<ImportJob[]>('GET','/contacts/imports');
export const getImportJob = (jobId:number) => apiCall<ImportJob>('GET',`/contacts/imports/${jobId}`);
export const getImportErrors = (jobId:number) => apiCall<any[]>('GET',`/contacts/imports/${jobId}/errors`);

export const listSuppression = () => apiCall<any[]>('GET','/contacts/suppression');
export const suppressEmails = (emails:string[], reason?:string) => apiCall('POST','/contacts/suppression', { emails, reason });
export const unsuppressEmail = (email:string) => apiCall('DELETE',`/contacts/suppression?email=${encodeURIComponent(email)}`);

export const listLists = () => apiCall<any[]>('GET','/contacts/lists');
export const createList = (body:{ name:string; description?:string; isDynamic?:boolean; dynamicQuery?:string; }) => apiCall('POST','/contacts/lists', body);
export const updateList = (listId:number, body:Partial<{ name:string; description:string; isDynamic:boolean; dynamicQuery:string; }>) => apiCall('PUT',`/contacts/lists/${listId}`, body);
export const deleteList = (listId:number) => apiCall('DELETE',`/contacts/lists/${listId}`);
export const listMembers = (listId:number) => apiCall<any[]>('GET',`/contacts/lists/${listId}/members`);
export const addMembersByEmails = (listId:number, emails:string[]) => apiCall('POST',`/contacts/lists/${listId}/members`, { emails });
export const removeMembersByEmails = (listId:number, emails:string[]) => apiCall('DELETE',`/contacts/lists/${listId}/members`, { emails } as any);
export const previewList = (listId:number) => apiCall<{count:number; sample:{id:number; email:string;}[]}>('GET',`/contacts/lists/${listId}/preview`);
export const materializeList = (listId:number) => apiCall<{inserted:number}>('POST',`/contacts/lists/${listId}/materialize`);

export const listCustomFields = () => apiCall<any[]>('GET','/contacts/custom-fields');
export const createCustomField = (body:{fieldKey:string; label?:string; dataType?:string; schemaJson?:string;}) => apiCall('POST','/contacts/custom-fields', body);
export const updateCustomField = (id:number, body:Partial<{label:string; dataType:string; schemaJson:string;}>) => apiCall('PUT',`/contacts/custom-fields/${id}`, body);
export const deleteCustomField = (id:number) => apiCall('DELETE',`/contacts/custom-fields/${id}`);
export const setContactCustomFields = (id:number, customJson:string) => apiCall('PUT',`/contacts/${id}/custom-fields`, { customJson });

export const exportContactsCsv = () => api.request({ method:'GET', url:'/contacts/export?format=csv', responseType:'blob' });
```

## Backend Endpoints (summary)
Base: `/contacts`
- Contacts CRUD: GET `/contacts`, POST `/contacts`, PUT `/contacts/{id}`, DELETE `/contacts/{id}?erase=bool`
- GDPR: POST `/contacts/{id}/request-delete`, DELETE `/contacts/{id}/purge`
- Activity: GET `/contacts/{id}/activity`
- Export: GET `/contacts/export?format=csv`
- Import: POST `/contacts/bulk` (metadata), POST `/contacts/import` (multipart), GET `/contacts/imports`, GET `/contacts/imports/{jobId}`, GET `/contacts/imports/{jobId}/progress`, GET `/contacts/imports/{jobId}/errors`
- Suppression: GET `/contacts/suppression`, POST `/contacts/suppression`, DELETE `/contacts/suppression?email=`
- Lists (Segments): GET `/contacts/lists`, POST `/contacts/lists`, PUT `/contacts/lists/{listId}`, DELETE `/contacts/lists/{listId}`
  - Members: GET `/contacts/lists/{listId}/members`, POST `/contacts/lists/{listId}/members`, DELETE `/contacts/lists/{listId}/members`
  - Preview: GET `/contacts/lists/{listId}/preview`
  - Materialize: POST `/contacts/lists/{listId}/materialize`
- Custom Fields: GET `/contacts/custom-fields`, POST `/contacts/custom-fields`, PUT `/contacts/custom-fields/{id}`, DELETE `/contacts/custom-fields/{id}`
- Contact custom JSON: PUT `/contacts/{id}/custom-fields`

## Dynamic Lists: dynamic_query JSON
Backend supports these operators (all ANDed together):
- segmentEquals: exact match on `contacts.segment`.
- segmentStartsWith: prefix match via `LIKE 'value%'`.
- segmentContains: substring match (case-insensitive) via `LOWER(segment) LIKE '%value%'`.
- unsubscribed: boolean flag on `contacts.unsubscribed`.

Examples (for `Create/Update List` body):
- Exact: `"{\"segmentEquals\":\"VIP\"}"`
- StartsWith: `"{\"segmentStartsWith\":\"VIP\"}"`
- Contains: `"{\"segmentContains\":\"prospect\"}"`
- Unsubscribed: `"{\"unsubscribed\":true}"`
- Combined: `"{\"segmentContains\":\"vip\",\"unsubscribed\":false}"`

Preview & materialize endpoints use the same filters.

## Import CSV Workflow
1) Optional: Create an import job metadata with mapping
- POST `/contacts/bulk` body: `{ mapping?: string, dedupe_strategy?: 'MERGE'|'SKIP'|'OVERWRITE', filename?: string }`
2) Upload the CSV
- POST `/contacts/import` as multipart: `file` (required), `mapping` (optional string)
3) Backend stages rows and moves job to READY_FOR_PROCESSING
4) Background worker processes in batches; pushes progress via WebSocket and updates REST job status

Mapping JSON (examples)
- By header names:
```
{
  "email": "Email",
  "firstName": "First Name",
  "lastName": "Last Name",
  "phone": "Phone",
  "country": "Country",
  "city": "City",
  "segment": "Segment",
  "unsubscribed": "Unsubscribed",
  "custom": { "crm_id": "CRM ID", "plan": "Plan" }
}
```
- By indexes (0-based):
```
{ "emailIndex":0, "firstNameIndex":1, "lastNameIndex":2, "phoneIndex":3, "countryIndex":4, "cityIndex":5, "segmentIndex":6, "unsubscribedIndex":7 }
```

Dedupe strategies
- MERGE (default): upsert, coalescing missing fields.
- SKIP: insert only if not exists.
- OVERWRITE: replace existing fields.

## Real‑time Job Progress (WebSocket)
- Endpoint: `GET ws(s)://{host}/ws` (SockJS fallback enabled)
- Subscribe to: `/topic/imports/{userId}`
- Message: `{ id, processed_rows, failed_rows, total_rows, status }`

React usage example (STOMP):
```
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function useImportProgress(userId:number){
  const [progress, setProgress] = useState<any|null>(null);
  useEffect(()=>{
    const sock = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({ webSocketFactory: () => sock as any, reconnectDelay: 5000 });
    client.onConnect = () => {
      client.subscribe(`/topic/imports/${userId}`, (msg)=>{
        const body = JSON.parse(msg.body); setProgress(body);
      });
    };
    client.activate();
    return () => client.deactivate();
  },[userId]);
  return progress;
}
```
Fallback polling endpoint: `GET /contacts/imports/{jobId}/progress`.

## Suppression List UX
- Upload or type emails to suppress with a reason (e.g., hard bounce, complaint).
- Backend prevents imports for suppressed emails.
- Endpoints: `GET /contacts/suppression`, `POST /contacts/suppression`, `DELETE /contacts/suppression?email=`

## Custom Fields UX
- Define fields in metadata: key, label, dataType (string/number/date/json), optional JSON schema.
- Set per-contact JSON via `PUT /contacts/{id}/custom-fields` with `customJson` string.

## Export
- CSV download: `GET /contacts/export?format=csv` with `Authorization` header.

## Try it
1) Start backend and frontend
2) Login to get JWT
3) Import a small CSV (Email, First Name, Last Name, Segment columns)
4) Watch progress via WebSocket; check `/contacts/imports` for history
5) Create a dynamic list with `dynamicQuery` (e.g., contains vip)
6) Preview, then materialize list; view members
7) Suppress a test email, retry import to see suppression error

## Notes & Edge Cases
- Invalid emails during import are marked FAILED and counted in `failed_rows`.
- Suppressed emails are rejected in import with error.
- Dynamic list filters are case-insensitive only for `segmentContains`.
- `delete` with `erase=false` acts like unsubscribe; `purge` removes data (GDPR).
- Ensure correct CORS and JWT settings for local development.

## Postman
A ready-to-use Postman collection for dynamic lists is in `backend/postman/DynamicLists.postman_collection.json`.
