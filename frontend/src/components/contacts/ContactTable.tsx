import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, CustomField } from '@api/contacts';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { 
  ChevronUp, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Check,
  X,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

interface ContactTableProps {
  contacts: Contact[];
  customFields: CustomField[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  onInlineEdit: (id: number, field: string, value: any) => void;
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
}

type SortField = 'email' | 'firstName' | 'lastName' | 'segment' | 'createdAt';

// Memoized individual row component for better performance
const ContactRow = memo<{
  contact: Contact;
  customFields: CustomField[];
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onInlineEdit: (field: string, value: any) => void;
}>(({ contact, customFields, isSelected, onSelect, onEdit, onDelete, onInlineEdit }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleStartEdit = useCallback((field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingField) {
      onInlineEdit(editingField, editValue);
      setEditingField(null);
    }
  }, [editingField, editValue, onInlineEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
  }, []);

  const renderEditableField = useCallback((field: string, value: string, placeholder: string) => {
    if (editingField === field) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={handleSaveEdit} icon={<Check className="w-3 h-3" />} />
          <Button variant="ghost" size="sm" onClick={handleCancelEdit} icon={<X className="w-3 h-3" />} />
        </div>
      );
    }

    return (
      <button
        onClick={() => handleStartEdit(field, value)}
        className="text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded px-1 py-0.5 transition-colors group"
      >
        <span className={value ? '' : 'text-neutral-400 italic'}>
          {value || placeholder}
        </span>
        <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 inline-block" />
      </button>
    );
  }, [editingField, editValue, handleStartEdit, handleSaveEdit, handleCancelEdit]);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx(
        'border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors',
        isSelected && 'bg-primary-50 dark:bg-primary-950/20'
      )}
    >
      {/* Selection */}
      <td className="px-4 py-4 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
        />
      </td>

      {/* Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {(contact.firstName?.[0] || contact.email[0]).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-neutral-900 dark:text-neutral-100">
              {renderEditableField('firstName', contact.firstName || '', 'First name')}
              {' '}
              {renderEditableField('lastName', contact.lastName || '', 'Last name')}
            </div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-900 dark:text-neutral-100">{contact.email}</span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 py-4">
        {contact.phone ? (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400">{contact.phone}</span>
          </div>
        ) : (
          <span className="text-neutral-400 italic">No phone</span>
        )}
      </td>

      {/* Location */}
      <td className="px-4 py-4">
        {contact.city || contact.country ? (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400">
              {[contact.city, contact.country].filter(Boolean).join(', ')}
            </span>
          </div>
        ) : (
          <span className="text-neutral-400 italic">No location</span>
        )}
      </td>

      {/* Segment */}
      <td className="px-4 py-4">
        {contact.segment ? (
          <Badge variant="outline">{contact.segment}</Badge>
        ) : (
          <span className="text-neutral-400 italic">No segment</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className="flex gap-1">
          {contact.unsubscribed ? (
            <Badge variant="warning" className="flex items-center gap-1">
              <UserX className="w-3 h-3" />
              Unsubscribed
            </Badge>
          ) : (
            <Badge variant="success" className="flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              Subscribed
            </Badge>
          )}
          {contact.suppressed && (
            <Badge variant="danger" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Suppressed
            </Badge>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
          <Calendar className="w-4 h-4" />
          <span>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '-'}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
            Delete
          </Button>
        </div>
      </td>
    </motion.tr>
  );
});

ContactRow.displayName = 'ContactRow';

export const ContactTable: React.FC<ContactTableProps> = memo(({
  contacts,
  customFields,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onInlineEdit,
  loading,
  sortBy,
  sortOrder,
  onSort
}) => {
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSort = (field: string) => {
    onSort(field);
  };

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

  const startEdit = (contact: Contact, field: string) => {
    setEditingCell({ id: contact.id, field });
    setEditValue(contact[field as keyof Contact] as string || '');
  };

  const saveEdit = () => {
    if (editingCell) {
      onInlineEdit(editingCell.id, editingCell.field, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getStatusIcon = (contact: Contact) => {
    if (contact.suppressed) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (contact.unsubscribed) {
      return <UserX className="w-4 h-4 text-amber-500" />;
    }
    return <UserCheck className="w-4 h-4 text-accent-500" />;
  };

  const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
    >
      {children}
      <motion.div
        animate={{ 
          opacity: sortBy === field ? 1 : 0.3,
          scale: sortBy === field ? 1 : 0.8
        }}
        className="flex flex-col"
      >
        <ChevronUp 
          className={clsx(
            'w-3 h-3 transition-colors',
            sortBy === field && sortOrder === 'asc' 
              ? 'text-primary-600' 
              : 'text-neutral-400'
          )} 
        />
        <ChevronDown 
          className={clsx(
            'w-3 h-3 -mt-1 transition-colors',
            sortBy === field && sortOrder === 'desc' 
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
        {Array.from({ length: 10 }).map((_, i) => (
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
          <div className="col-span-1">Status</div>
          <div className="col-span-3">
            <SortButton field="email">Contact</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="firstName">Name</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="segment">Segment</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="createdAt">Added</SortButton>
          </div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <AnimatePresence>
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.02, duration: 0.3 }}
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
            
            <div className="col-span-1">
              {getStatusIcon(contact)}
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
              {editingCell?.id === contact.id && editingCell?.field === 'firstName' ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-sm"
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit} icon={<Check className="w-3 h-3" />} />
                  <Button variant="ghost" size="sm" onClick={cancelEdit} icon={<X className="w-3 h-3" />} />
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded px-2 py-1 flex items-center gap-1"
                  onClick={() => startEdit(contact, 'firstName')}
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {contact.firstName} {contact.lastName}
                  </span>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              {contact.city && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {contact.city}
                </p>
              )}
            </div>
            
            <div className="col-span-2">
              {editingCell?.id === contact.id && editingCell?.field === 'segment' ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-sm"
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit} icon={<Check className="w-3 h-3" />} />
                  <Button variant="ghost" size="sm" onClick={cancelEdit} icon={<X className="w-3 h-3" />} />
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded px-2 py-1"
                  onClick={() => startEdit(contact, 'segment')}
                >
                  {contact.segment ? (
                    <Badge variant="info" size="sm">
                      {contact.segment}
                    </Badge>
                  ) : (
                    <span className="text-neutral-400 text-sm">No segment</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="col-span-2">
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
                  icon={<Edit3 className="w-3 h-3" />}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {contacts.length === 0 && (
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
});

ContactTable.displayName = 'ContactTable';

export default ContactTable;