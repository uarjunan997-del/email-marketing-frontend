import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact } from '@api/contacts';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { 
  ChevronUp, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import clsx from 'clsx';

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

type SortField = 'email' | 'firstName' | 'lastName' | 'segment' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  loading
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let aValue: any = (a as any)[sortField] ?? '';
    let bValue: any = (b as any)[sortField] ?? '';
    
    if (sortField === 'createdAt') {
      aValue = new Date(aValue as any).getTime();
      bValue = new Date(bValue as any).getTime();
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contacts.map(c => c.id));
    }
  };

  const handleSelectContact = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
    >
      {children}
      <motion.div
        animate={{ 
          opacity: sortField === field ? 1 : 0.3,
          scale: sortField === field ? 1 : 0.8
        }}
        className="flex flex-col"
      >
        <ChevronUp 
          className={clsx(
            'w-3 h-3 transition-colors',
            sortField === field && sortDirection === 'asc' 
              ? 'text-primary-600' 
              : 'text-neutral-400'
          )} 
        />
        <ChevronDown 
          className={clsx(
            'w-3 h-3 -mt-1 transition-colors',
            sortField === field && sortDirection === 'desc' 
              ? 'text-primary-600' 
              : 'text-neutral-400'
          )} 
        />
      </motion.div>
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      {/* Table Header */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedIds.length === contacts.length && contacts.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
            />
          </div>
          <div className="col-span-3">
            <SortButton field="email">Contact</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="firstName">Name</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="segment">Segment</SortButton>
          </div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">
            <SortButton field="createdAt">Added</SortButton>
          </div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <AnimatePresence>
        {sortedContacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={clsx(
              'grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group',
              selectedIds.includes(contact.id) && 'bg-primary-50 dark:bg-primary-950/20'
            )}
          >
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedIds.includes(contact.id)}
                onChange={() => handleSelectContact(contact.id)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
              />
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {contact.firstName?.[0] || contact.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {contact.email}
                  </p>
                  {contact.phone && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {contact.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                {contact.firstName} {contact.lastName}
              </p>
              {contact.city && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {contact.city}
                </p>
              )}
            </div>
            
            <div className="col-span-2">
              {contact.segment ? (
                <Badge variant="info" size="sm">
                  {contact.segment}
                </Badge>
              ) : (
                <span className="text-neutral-400 text-sm">No segment</span>
              )}
            </div>
            
            <div className="col-span-2">
              <Badge 
                variant={contact.unsubscribed ? 'danger' : 'success'} 
                size="sm"
                className="flex items-center gap-1"
              >
                {contact.unsubscribed ? (
                  <>
                    <UserX className="w-3 h-3" />
                    Unsubscribed
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3" />
                    Active
                  </>
                )}
              </Badge>
            </div>
            
            <div className="col-span-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            
            <div className="col-span-1">
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(contact)}
                  icon={<Edit className="w-3 h-3" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(contact.id)}
                  icon={<Trash2 className="w-3 h-3" />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {sortedContacts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
            No contacts found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactTable;