import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Contact, CustomField } from '@api/contacts';
import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  User,
  Check
} from 'lucide-react';

interface VirtualizedContactListProps {
  contacts: Contact[];
  customFields: CustomField[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  onInlineEdit?: (id: number, field: string, value: any) => void;
  loading?: boolean;
  height?: number;
}

const ITEM_HEIGHT = 120;
const BUFFER_SIZE = 5;

export const VirtualizedContactList: React.FC<VirtualizedContactListProps> = ({
  contacts,
  customFields,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  loading,
  height = 600
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const containerHeight = height;
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      contacts.length - 1,
      Math.floor((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE
    );

    return {
      startIndex,
      endIndex,
      items: contacts.slice(startIndex, endIndex + 1),
      offsetY: startIndex * ITEM_HEIGHT
    };
  }, [contacts, scrollTop, height]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSelect = useCallback((contactId: number) => {
    if (selectedIds.includes(contactId)) {
      onSelectionChange(selectedIds.filter(id => id !== contactId));
    } else {
      onSelectionChange([...selectedIds, contactId]);
    }
  }, [selectedIds, onSelectionChange]);

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || email?.[0]?.toUpperCase() || '?';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <User className="w-6 h-6 text-primary-500" />
          </motion.div>
          <span className="text-neutral-600 dark:text-neutral-400">Loading contacts...</span>
        </div>
      </Card>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <div className="py-12">
          <User className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
            No contacts found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Try adjusting your filters or import some contacts to get started.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {contacts.length} contacts
            </span>
            {selectedIds.length > 0 && (
              <Badge variant="accent" size="sm">
                {selectedIds.length} selected
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
              disabled={selectedIds.length === 0}
            >
              Clear Selection
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange(contacts.map(c => c.id))}
              disabled={selectedIds.length === contacts.length}
            >
              Select All
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollElementRef}
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: contacts.length * ITEM_HEIGHT, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${visibleItems.offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleItems.items.map((contact, index) => {
              const actualIndex = visibleItems.startIndex + index;
              const isSelected = selectedIds.includes(contact.id);
              
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  style={{ height: ITEM_HEIGHT }}
                  className="px-4 py-2"
                >
                  <Card 
                    variant="glass" 
                    padding="md" 
                    className={`h-full transition-all duration-200 cursor-pointer hover:shadow-lg ${
                      isSelected ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950/20' : ''
                    }`}
                    onClick={() => handleSelect(contact.id)}
                  >
                    <div className="flex items-center gap-4 h-full">
                      {/* Selection Checkbox */}
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-500' 
                            : 'border-neutral-300 dark:border-neutral-600 hover:border-primary-400'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(contact.firstName, contact.lastName, contact.email)}
                        </div>
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {contact.firstName || contact.lastName 
                              ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                              : 'No Name'
                            }
                          </h3>
                          {contact.unsubscribed && (
                            <Badge variant="warning" size="sm">Unsubscribed</Badge>
                          )}
                          {contact.suppressed && (
                            <Badge variant="danger" size="sm">Suppressed</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          
                          {(contact.city || contact.country) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Segment & Date */}
                      <div className="flex-shrink-0 text-right">
                        {contact.segment && (
                          <Badge variant="outline" className="mb-1">
                            {contact.segment}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(contact.createdAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(contact);
                            }}
                            icon={<Edit className="w-4 h-4" />}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(contact.id);
                            }}
                            icon={<Trash2 className="w-4 h-4" />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<MoreVertical className="w-4 h-4" />}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VirtualizedContactList;
