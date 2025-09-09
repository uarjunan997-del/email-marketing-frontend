import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Card } from '@components/atoms/Card';
import { Button } from '@components/atoms/Button';
import { Badge } from '@components/atoms/Badge';
import { Input } from '@components/atoms/Input';
import ContactTable from '@components/contacts/ContactTable';
import { VirtualizedContactList } from '@components/contacts/VirtualizedContactList';
import ContactCards from '@components/contacts/ContactCards';
import BulkActionToolbar from '@components/ui/BulkActionToolbar';
import SmartSearch from '@components/ui/SmartSearch';
import SegmentBuilder from '@components/ui/SegmentBuilder';
import AdvancedFilters, { AdvancedFilter } from '@components/ui/AdvancedFilters';
import AddToSegmentModal from '@components/modals/AddToSegmentModal';
import ExportModal, { ExportField } from '@components/modals/ExportModal';

import { useContactUpdates, ContactUpdateMessage } from '@hooks/useWebSocket';

import { 
  listContacts, 
  listSegments, 
  listCustomFields,
  updateContact,
  exportContactsCsv,
  exportContactsAdvanced,
  deleteContact,
  bulkDeleteContacts,
  bulkUpdateContacts,
  bulkAddToSegment,
  previewSegment,
  Contact,
  Segment,
  CustomField,
  SegmentFilter as ApiSegmentFilter
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
  TrendingUp,
  Settings
} from 'lucide-react';

// UI SegmentFilter interface that matches SegmentBuilder component
interface UISegmentFilter {
  id: string;
  type: 'segment' | 'status' | 'custom';
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'not_equals';
  value: string;
  label: string;
}

type ViewMode = 'table' | 'cards';
type SortField = 'email' | 'firstName' | 'lastName' | 'segment' | 'createdAt';

export const ContactsListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [segmentFilters, setSegmentFilters] = useState<UISegmentFilter[]>([]);
  const [segmentPreviewLoading, setSegmentPreviewLoading] = useState(false);
  const [segmentPreviewCount, setSegmentPreviewCount] = useState<number | null>(null);
  const [showAddToSegmentModal, setShowAddToSegmentModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalContacts, setTotalContacts] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Load data
  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listContacts({
        segment: selectedSegment === 'all' ? undefined : selectedSegment,
        search: searchQuery || undefined,
        filters: advancedFilters.length > 0 ? JSON.stringify(advancedFilters) : undefined,
        page: currentPage,
        limit: pageSize,
        sortBy,
        sortOrder
      });
      
  setContacts(response.contacts || []);
  setTotalContacts(response.total || 0);
    } catch (error) {
      toast.error('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedSegment, searchQuery, advancedFilters, currentPage, pageSize, sortBy, sortOrder]);

  // Real-time contact updates
  const handleContactUpdate = useCallback((message: ContactUpdateMessage) => {
    switch (message.type) {
      case 'CONTACT_CREATED':
        if (message.contact) {
          toast.success(`New contact added: ${message.contact.email}`);
          loadContacts(); // Refresh the list
        }
        break;
      case 'CONTACT_UPDATED':
        if (message.contact) {
          setContacts(prev => prev.map(c => 
            c.id === message.contact!.id ? { ...c, ...message.contact } : c
          ));
          toast.success(`Contact updated: ${message.contact.email}`);
        }
        break;
      case 'CONTACT_DELETED':
        if (message.contactIds) {
          setContacts(prev => prev.filter(c => !message.contactIds!.includes(c.id)));
          toast.success(`${message.contactIds.length} contact(s) deleted`);
        }
        break;
      case 'BULK_UPDATE':
        if (message.contactIds) {
          toast.success(`${message.contactIds.length} contact(s) updated`);
          loadContacts(); // Refresh for bulk updates
        }
        break;
    }
  }, [loadContacts]);

  const { connected: wsConnected } = useContactUpdates(1, handleContactUpdate); // TODO: Get actual user ID

  const loadSegments = async () => {
    try {
      const data = await listSegments();
      setSegments(data);
    } catch (error) {
      console.error('Failed to load segments:', error);
    }
  };

  const loadCustomFields = async () => {
    try {
      const data = await listCustomFields();
      setCustomFields(data);
    } catch (error) {
      console.error('Failed to load custom fields:', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    loadSegments();
    loadCustomFields();
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentContactSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Auto-preview segment when filters change
  useEffect(() => {
    if (showSegmentBuilder) {
      handleSegmentPreview();
    }
  }, [segmentFilters, showSegmentBuilder]);

  // Reload contacts when advanced filters change
  useEffect(() => {
    if (advancedFilters.length > 0) {
      loadContacts();
    }
  }, [advancedFilters]);

  // Handlers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field as SortField);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    // Save to recent searches if it's a meaningful search
    if (query.trim() && query.length > 2) {
      const newRecentSearches = [
        query,
        ...recentSearches.filter(s => s !== query)
      ].slice(0, 5); // Keep only last 5 searches
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentContactSearches', JSON.stringify(newRecentSearches));
    }
  };

  const handleSegmentChange = (segment: string) => {
    setSelectedSegment(segment);
    setCurrentPage(1);
  };

  const handleSegmentPreview = async () => {
    if (segmentFilters.length === 0) {
      setSegmentPreviewCount(totalContacts);
      return;
    }

    setSegmentPreviewLoading(true);
    try {
      // Convert UI filters to API filters
      const apiFilters: ApiSegmentFilter[] = segmentFilters.map(filter => ({
        field: filter.field,
        operator: filter.operator,
        value: filter.value
      }));

      const result = await previewSegment(apiFilters);
      setSegmentPreviewCount(result.count);
      toast.success(`Preview: ${result.count} contacts match these filters`);
    } catch (error) {
      toast.error('Failed to preview segment');
      console.error('Segment preview error:', error);
    } finally {
      setSegmentPreviewLoading(false);
    }
  };

  const handleInlineEdit = async (id: number, field: string, value: any) => {
    try {
      await updateContact(id, { [field]: value });
      toast.success('Contact updated');
      loadContacts();
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleEditContact = (contact: Contact) => {
    navigate(`/contacts/${contact.id}/edit`);
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
    try {
      await bulkUpdateContacts(selectedIds, { unsubscribed: true });
      toast.success(`${selectedIds.length} contacts unsubscribed`);
      setSelectedIds([]);
      loadContacts();
    } catch (error) {
      toast.error('Failed to unsubscribe contacts');
    }
  };

  const handleBulkResubscribe = async () => {
    try {
      await bulkUpdateContacts(selectedIds, { unsubscribed: false });
      toast.success(`${selectedIds.length} contacts resubscribed`);
      setSelectedIds([]);
      loadContacts();
    } catch (error) {
      toast.error('Failed to resubscribe contacts');
    }
  };

  const handleBulkExport = async () => {
    setShowExportModal(true);
  };

  const handleExport = async (fields: string[], format: 'csv' | 'xlsx') => {
    setExportLoading(true);
    try {
      // Convert selectedIds to strings and prepare export options
      const contactIds = selectedIds.length > 0 ? selectedIds.map(id => id.toString()) : undefined;
      
      // Prepare filters in the format expected by backend
      const filters = advancedFilters.length > 0 ? 
        Object.fromEntries(advancedFilters.map(f => [f.field, { operator: f.operator, value: f.value }])) 
        : undefined;
      
      // Prepare export options
      const exportOptions = {
        fields: fields.length > 0 ? fields : undefined,
        format,
        contactIds,
        filters
      };

      const result = await exportContactsAdvanced(exportOptions);
      
      if (result.blob) {
        // Handle immediate CSV download
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Export completed successfully');
        setShowExportModal(false);
      } else if (result.downloadUrl) {
        // Handle download URL (for non-CSV formats)
        const a = document.createElement('a');
        a.href = result.downloadUrl;
        a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('Export completed successfully');
        setShowExportModal(false);
      } else {
        toast.error('No export data received');
      }
    } catch (error) {
      toast.error('Failed to export contacts');
      console.error('Export error:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const handleBulkAddToSegment = () => {
    setShowAddToSegmentModal(true);
  };

  const handleBulkSendEmail = () => {
    navigate('/campaigns/new', { 
      state: { selectedContacts: selectedIds } 
    });
  };

  const searchSuggestions = segments
    .filter(s => s.name !== 'All Subscribers')
    .map(s => s.name)
    .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(totalContacts / pageSize);

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
            {wsConnected && (
              <span className="ml-3 inline-flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="ml-1 text-xs text-green-600 dark:text-green-400">Live</span>
              </span>
            )}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage your subscriber list and segments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/import')}
            icon={<Upload className="w-4 h-4" />}
          >
            Import
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/custom-fields')}
            icon={<Settings className="w-4 h-4" />}
          >
            Fields
          </Button>
          <Button
            onClick={() => navigate('/contacts/new')}
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
            value: totalContacts.toLocaleString(), 
            icon: <Users className="w-5 h-5" />,
            color: 'from-primary-500 to-primary-600'
          },
          { 
            label: 'Active Subscribers', 
            value: contacts.filter(c => !c.unsubscribed && !c.suppressed).length.toLocaleString(), 
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
              recentSearches={recentSearches}
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
                    onClick={() => handleSegmentChange(segment.value)}
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
                  onClick={() => setShowSegmentBuilder(prev => !prev)}
                  icon={<Sparkles className="w-4 h-4" />}
                  className={showSegmentBuilder ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600' : ''}
                >
                  Smart Segments
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(prev => !prev)}
                  icon={<Filter className="w-4 h-4" />}
                  className={showAdvancedFilters || advancedFilters.length > 0 ? 'bg-accent-50 dark:bg-accent-950/20 text-accent-600' : ''}
                >
                  Advanced Filters
                  {advancedFilters.length > 0 && (
                    <Badge variant="accent" size="sm" className="ml-1">
                      {advancedFilters.length}
                    </Badge>
                  )}
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
                  previewCount={segmentPreviewCount ?? undefined}
                  onPreview={handleSegmentPreview}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AdvancedFilters
              filters={advancedFilters}
              onChange={setAdvancedFilters}
              availableSegments={segments.map(s => s.name).filter(name => name !== 'All Subscribers')}
              customFields={customFields}
              isOpen={showAdvancedFilters}
              onToggle={() => setShowAdvancedFilters(prev => !prev)}
            />
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
              <VirtualizedContactList
                contacts={contacts}
                customFields={customFields}
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
                contacts={contacts}
                customFields={customFields}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card variant="glass" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Show:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus-ring"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={500}>500</option>
                </select>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  of {totalContacts} contacts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary-500 text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      {/* Add to Segment Modal */}
      <AddToSegmentModal
        isOpen={showAddToSegmentModal}
        onClose={() => setShowAddToSegmentModal(false)}
        contactIds={selectedIds}
        availableSegments={segments.map(s => s.name).filter(name => name !== 'All Subscribers')}
        onSuccess={() => {
          setSelectedIds([]);
          loadContacts();
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        availableFields={customFields.map(cf => ({
          id: cf.fieldKey,
          label: cf.label,
          icon: <Settings className="w-4 h-4" />,
          category: 'custom' as const
        }))}
        selectedCount={selectedIds.length > 0 ? selectedIds.length : undefined}
        loading={exportLoading}
      />
    </div>
  );
};

export default ContactsListPage;