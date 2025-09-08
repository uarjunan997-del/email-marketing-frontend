import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact, CustomField } from '@api/contacts';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { Button } from '@components/atoms/Button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

interface ContactCardsProps {
  contacts: Contact[];
  customFields: CustomField[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const ContactCards: React.FC<ContactCardsProps> = ({
  contacts,
  customFields,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  loading
}) => {
  const handleSelectContact = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getStatusBadge = (contact: Contact) => {
    if (contact.suppressed) {
      return (
        <Badge variant="danger" size="sm" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Suppressed
        </Badge>
      );
    }
    if (contact.unsubscribed) {
      return (
        <Badge variant="warning" size="sm" className="flex items-center gap-1">
          <UserX className="w-3 h-3" />
          Unsubscribed
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm" className="flex items-center gap-1">
        <UserCheck className="w-3 h-3" />
        Active
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            layout
          >
            <Card 
              hover 
              variant="gradient" 
              className={`relative group cursor-pointer transition-all duration-300 ${
                selectedIds.includes(contact.id) 
                  ? 'ring-2 ring-primary-500 shadow-glow' 
                  : ''
              }`}
              onClick={() => handleSelectContact(contact.id)}
            >
              {/* Selection indicator */}
              <div className="absolute top-4 right-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(contact.id)}
                  onChange={() => handleSelectContact(contact.id)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Avatar and basic info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {contact.firstName?.[0] || contact.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 truncate">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                    {contact.email}
                  </p>
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-2 mb-4">
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </div>
                )}
                {contact.city && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    {contact.city}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {/* Status and segment */}
              <div className="flex items-center justify-between mb-4">
                {getStatusBadge(contact)}
                {contact.segment && (
                  <Badge variant="info" size="sm">
                    {contact.segment}
                  </Badge>
                )}
              </div>

              {/* Custom fields preview */}
              {contact.customFields && Object.keys(contact.customFields).length > 0 && (
                <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                    Custom Fields
                  </p>
                  <div className="space-y-1">
                    {Object.entries(contact.customFields).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-neutral-600 dark:text-neutral-400">{key}:</span>
                        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                    {Object.keys(contact.customFields).length > 2 && (
                      <p className="text-xs text-neutral-500">
                        +{Object.keys(contact.customFields).length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(contact);
                  }}
                  icon={<Edit className="w-4 h-4" />}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show more options menu
                  }}
                  icon={<MoreHorizontal className="w-4 h-4" />}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {contacts.length === 0 && (
        <div className="col-span-full text-center py-16">
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

export default ContactCards;