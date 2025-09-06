import { apiCall } from '../utils/api';

export interface Contact { id: number; email: string; firstName?: string; lastName?: string; segment?: string | null; unsubscribed?: boolean; }

// List contacts (optionally by segment)
export const listContacts = (segment?: string) => {
  const qs = segment ? `?segment=${encodeURIComponent(segment)}` : '';
  return apiCall<Contact[]>('GET', `/contacts${qs}`);
};

// Derive available segments from contacts in-memory (could become its own endpoint later)
export const listSegments = async (): Promise<{ name: string; value: string; count: number }[]> => {
  const contacts = await listContacts();
  const segmentCounts: Record<string, number> = {};
  let total = 0;
  contacts.forEach((c: Contact) => {
    total++;
    if(c.segment){ segmentCounts[c.segment] = (segmentCounts[c.segment]||0)+1; }
  });
  return [
    { name: 'All Subscribers', value: 'all', count: total },
    ...Object.entries(segmentCounts).map(([seg,count]) => ({ name: seg, value: seg, count }))
  ];
};
