import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import ContactTable from '@components/ui/ContactTable';
import ContactCards from '@components/ui/ContactCards';
import BulkActionToolbar from '@components/ui/BulkActionToolbar';
import SmartSearch from '@components/ui/SmartSearch';
import ImportDropzone from '@components/ui/ImportDropzone';
import SegmentBuilder from '@components/ui/SegmentBuilder';

import { 
  listContacts, 
  listSegments, 
  createContact, 
  updateContact, 
  deleteContact,
  bulkDeleteContacts,
  uploadImport,
  Contact,
  Segment
} from '@api/contacts';

import { 
  Plus, 
  Users, 
  Upload, 
  Filter, 
  Grid3X3, 
  List,
  Download,
  Sparkles,
  Mail,
  TrendingUp
} from 'lucide-react';

type ViewMode = 'table' | 'cards';

export const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showImport, setShowImport] = useState(false);
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [segmentFilters, setSegmentFilters] = useState<any[]>([]);

  // Load data
  useEffect(() => {
    loadContacts();
    loadSegments();
  }, [selectedSegment, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    try {
  const data = await listContacts({
        segment: selectedSegment === 'all' ? undefined : selectedSegment,
        search: searchQuery || undefined
      });
  setContacts(data.contacts);
    } catch (error) {
      toast.error('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSegments = async () => {
    try {
      const data = await listSegments();
      setSegments(data);
    } catch (error) {
      console.error('Failed to load segments:', error);
    }
  };

  // Contact actions
  const handleEditContact = (contact: Contact) => {
    // TODO: Open edit modal
    console.log('Edit contact:', contact);
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast.success('Contact deleted');
        loadContacts();
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.length} contacts?`)) {
      try {
        await bulkDeleteContacts(selectedIds);
        toast.success(`${selectedIds.length} contacts deleted`);
        setSelectedIds([]);
        loadContacts();
      } catch (error) {
        toast.error('Failed to delete contacts');
      }
    }
  };

  const handleBulkUnsubscribe = async () => {
    // TODO: Implement bulk unsubscribe
    toast.success(`${selectedIds.length} contacts unsubscribed`);
    setSelectedIds([]);
  };

  const handleBulkResubscribe = async () => {
    // TODO: Implement bulk resubscribe
    toast.success(`${selectedIds.length} contacts resubscribed`);
    setSelectedIds([]);
  };

  const handleBulkExport = async () => {
    // TODO: Implement bulk export
    toast.success('Export started');
  };

  const handleBulkAddToSegment = () => {
    // TODO: Open segment selection modal
    console.log('Add to segment:', selectedIds);
  };

  const handleBulkSendEmail = () => {
    // TODO: Open email composer
    console.log('Send email to:', selectedIds);
  };

  // Import
  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name);
  };

  const handleUpload = async (file: File, mapping?: string) => {
    setImportLoading(true);
    try {
      await uploadImport(file, mapping);
      toast.success('Import started successfully!');
      setShowImport(false);
      loadContacts();
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setImportLoading(false);
    }
  };

  // Search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const searchSuggestions = segments.map(s => s.name).filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Segment builder
  const handleSegmentPreview = () => {
    // TODO: Preview segment with filters
    console.log('Preview segment with filters:', segmentFilters);
  };

  const filteredContacts = contacts; // Already filtered by API

  return (
    <div className="space-y-6">
      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onDelete={handleBulkDelete}
        onUnsubscribe={handleBulkUnsubscribe}
        onResubscribe={handleBulkResubscribe}
        onExport={handleBulkExport}
        onAddToSegment={handleBulkAddToSegment}
        onSendEmail={handleBulkSendEmail}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-neutral-100 mb-2">
            Contacts
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your subscriber list and segments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}
            icon={<Upload className="w-4 h-4" />}
          >
            Import
          </Button>
          <Button
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Add Contact
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { 
            label: 'Total Contacts', 
            value: contacts.length.toLocaleString(), 
            icon: <Users className="w-5 h-5" />,
            color: 'from-primary-500 to-primary-600'
          },
          { 
            label: 'Active Subscribers', 
            value: contacts.filter(c => !c.unsubscribed).length.toLocaleString(), 
            icon: <Mail className="w-5 h-5" />,
            color: 'from-accent-500 to-accent-600'
          },
          { 
            label: 'Segments', 
            value: segments.length - 1, // Exclude "All"
            icon: <Filter className="w-5 h-5" />,
            color: 'from-secondary-500 to-secondary-600'
          },
          { 
            label: 'Growth Rate', 
            value: '+12%', 
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'from-amber-500 to-amber-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            <Card variant="gradient" className="text-center relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg text-white`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card variant="glass" padding="md">
          <div className="space-y-4">
            {/* Search */}
            <SmartSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              suggestions={searchSuggestions}
              loading={loading}
            />

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Segment Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                  Segment:
                </span>
                {segments.map(segment => (
                  <motion.button
                    key={segment.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSegment(segment.value)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSegment === segment.value
                        ? 'bg-primary-500 text-white shadow-glow'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                    }`}
                  >
                    {segment.name}
                    <Badge variant="outline" size="sm" className="ml-2">
                      {segment.count}
                    </Badge>
                  </motion.button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSegmentBuilder(!showSegmentBuilder)}
                  icon={<Sparkles className="w-4 h-4" />}
                  className={showSegmentBuilder ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600' : ''}
                >
                  Smart Segments
                </Button>
                
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-white dark:bg-neutral-700 shadow-sm' 
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'cards' 
                        ? 'bg-white dark:bg-neutral-700 shadow-sm' 
                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Segment Builder */}
      <AnimatePresence>
        {showSegmentBuilder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card variant="gradient">
              <SegmentBuilder
                filters={segmentFilters}
                onChange={setSegmentFilters}
                availableSegments={segments.map(s => s.name).filter(name => name !== 'All Subscribers')}
                onPreview={handleSegmentPreview}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contacts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ContactTable
                contacts={filteredContacts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ContactCards
                contacts={filteredContacts}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowImport(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                        Import Contacts
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Upload your contact list from CSV or Excel
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImport(false)}
                    icon={<Plus className="w-4 h-4 rotate-45" />}
                  />
                </div>
              </div>
              
              <div className="p-6">
                <ImportDropzone
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  loading={importLoading}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsPage;