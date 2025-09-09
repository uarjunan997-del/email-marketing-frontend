import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { Card } from '@components/atoms/Card';
import { Badge } from '@components/atoms/Badge';
import { 
  Filter, 
  X, 
  Plus, 
  Calendar,
  Users,
  Mail,
  Tag,
  Type,
  Hash,
  Clock,
  Search
} from 'lucide-react';

export interface AdvancedFilter {
  id: string;
  type: 'text' | 'status' | 'date' | 'custom' | 'segment';
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'not_equals' | 'greater_than' | 'less_than' | 'between';
  value: string | string[] | { from: string; to: string };
  label: string;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilter[];
  onChange: (filters: AdvancedFilter[]) => void;
  availableSegments: string[];
  customFields: Array<{ fieldKey: string; label: string; dataType: string }>;
  isOpen: boolean;
  onToggle: () => void;
}

const filterTypes = [
  { id: 'text', label: 'Text Field', icon: <Type className="w-4 h-4" /> },
  { id: 'status', label: 'Status', icon: <Users className="w-4 h-4" /> },
  { id: 'date', label: 'Date Range', icon: <Calendar className="w-4 h-4" /> },
  { id: 'segment', label: 'Segment', icon: <Tag className="w-4 h-4" /> },
  { id: 'custom', label: 'Custom Field', icon: <Hash className="w-4 h-4" /> }
];

const textFields = [
  { id: 'email', label: 'Email' },
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'phone', label: 'Phone' },
  { id: 'country', label: 'Country' },
  { id: 'city', label: 'City' }
];

const statusFields = [
  { id: 'unsubscribed', label: 'Subscription Status' },
  { id: 'suppressed', label: 'Suppression Status' }
];

const dateFields = [
  { id: 'createdAt', label: 'Created Date' },
  { id: 'updatedAt', label: 'Updated Date' }
];

const operators = {
  text: [
    { id: 'contains', label: 'contains' },
    { id: 'equals', label: 'equals' },
    { id: 'startsWith', label: 'starts with' },
    { id: 'not_equals', label: 'does not equal' }
  ],
  status: [
    { id: 'equals', label: 'is' },
    { id: 'not_equals', label: 'is not' }
  ],
  date: [
    { id: 'greater_than', label: 'after' },
    { id: 'less_than', label: 'before' },
    { id: 'between', label: 'between' }
  ],
  segment: [
    { id: 'equals', label: 'is' },
    { id: 'not_equals', label: 'is not' }
  ],
  custom: [
    { id: 'contains', label: 'contains' },
    { id: 'equals', label: 'equals' }
  ]
};

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onChange,
  availableSegments,
  customFields,
  isOpen,
  onToggle
}) => {
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<AdvancedFilter>>({
    type: 'text',
    operator: 'contains'
  });

  const addFilter = () => {
    if (newFilter.field && newFilter.value) {
      const filter: AdvancedFilter = {
        id: Date.now().toString(),
        type: newFilter.type as AdvancedFilter['type'],
        field: newFilter.field,
        operator: newFilter.operator as AdvancedFilter['operator'],
        value: newFilter.value,
        label: generateFilterLabel(newFilter as AdvancedFilter)
      };
      
      onChange([...filters, filter]);
      setNewFilter({ type: 'text', operator: 'contains' });
      setShowAddFilter(false);
    }
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const clearAllFilters = () => {
    onChange([]);
  };

  const generateFilterLabel = (filter: Partial<AdvancedFilter>): string => {
    const fieldLabel = getFieldLabel(filter.field!, filter.type!);
    const operatorLabel = operators[filter.type as keyof typeof operators]
      ?.find(op => op.id === filter.operator)?.label || filter.operator;
    
    let valueLabel = '';
    if (typeof filter.value === 'string') {
      valueLabel = `"${filter.value}"`;
    } else if (Array.isArray(filter.value)) {
      valueLabel = filter.value.join(', ');
    } else if (filter.value && typeof filter.value === 'object' && 'from' in filter.value) {
      valueLabel = `${filter.value.from} to ${filter.value.to}`;
    }
    
    return `${fieldLabel} ${operatorLabel} ${valueLabel}`;
  };

  const getFieldLabel = (fieldId: string, type: string): string => {
    switch (type) {
      case 'text':
        return textFields.find(f => f.id === fieldId)?.label || fieldId;
      case 'status':
        return statusFields.find(f => f.id === fieldId)?.label || fieldId;
      case 'date':
        return dateFields.find(f => f.id === fieldId)?.label || fieldId;
      case 'segment':
        return 'Segment';
      case 'custom':
        return customFields.find(f => f.fieldKey === fieldId)?.label || fieldId;
      default:
        return fieldId;
    }
  };

  const getFilterColor = (type: AdvancedFilter['type']) => {
    switch (type) {
      case 'text': return 'blue';
      case 'status': return 'green';
      case 'date': return 'purple';
      case 'segment': return 'orange';
      case 'custom': return 'pink';
      default: return 'gray';
    }
  };

  const getAvailableFields = () => {
    switch (newFilter.type) {
      case 'text':
        return textFields;
      case 'status':
        return statusFields;
      case 'date':
        return dateFields;
      case 'segment':
        return [{ id: 'segment', label: 'Segment' }];
      case 'custom':
        return customFields.map(cf => ({ id: cf.fieldKey, label: cf.label }));
      default:
        return [];
    }
  };

  const getAvailableOperators = () => {
    return operators[newFilter.type as keyof typeof operators] || [];
  };

  const renderValueInput = () => {
    if (newFilter.type === 'status') {
      const statusOptions = newFilter.field === 'unsubscribed' 
        ? [{ id: 'true', label: 'Unsubscribed' }, { id: 'false', label: 'Subscribed' }]
        : [{ id: 'true', label: 'Suppressed' }, { id: 'false', label: 'Not Suppressed' }];
      
      return (
        <select
          value={newFilter.value as string || ''}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus-ring"
        >
          <option value="">Select status...</option>
          {statusOptions.map(option => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (newFilter.type === 'segment') {
      return (
        <select
          value={newFilter.value as string || ''}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
          className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus-ring"
        >
          <option value="">Select segment...</option>
          {availableSegments.map(segment => (
            <option key={segment} value={segment}>{segment}</option>
          ))}
        </select>
      );
    }

    if (newFilter.type === 'date' && newFilter.operator === 'between') {
      const dateValue = newFilter.value as { from: string; to: string } || { from: '', to: '' };
      return (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateValue.from}
            onChange={(e) => setNewFilter({ 
              ...newFilter, 
              value: { ...dateValue, from: e.target.value } 
            })}
            className="flex-1"
          />
          <span className="text-neutral-500">to</span>
          <Input
            type="date"
            value={dateValue.to}
            onChange={(e) => setNewFilter({ 
              ...newFilter, 
              value: { ...dateValue, to: e.target.value } 
            })}
            className="flex-1"
          />
        </div>
      );
    }

    if (newFilter.type === 'date') {
      return (
        <Input
          type="date"
          value={newFilter.value as string || ''}
          onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
        />
      );
    }

    return (
      <Input
        type="text"
        value={newFilter.value as string || ''}
        onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
        placeholder="Enter value..."
      />
    );
  };

  return (
    <Card variant="glass" padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              Advanced Filters
            </h3>
            {filters.length > 0 && (
              <Badge variant="accent" size="sm">
                {filters.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              icon={isOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-4"
            >
              {/* Filter Tags */}
              {filters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-${getFilterColor(filter.type)}-100 text-${getFilterColor(filter.type)}-700 dark:bg-${getFilterColor(filter.type)}-900/20 dark:text-${getFilterColor(filter.type)}-300`}
                    >
                      <span>{filter.label}</span>
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add Filter Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddFilter(!showAddFilter)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Filter
                </Button>
              </div>

              {/* Add Filter Form */}
              <AnimatePresence>
                {showAddFilter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      {/* Filter Type */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Filter Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {filterTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setNewFilter({ ...newFilter, type: type.id as any, field: '', value: '' })}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                                newFilter.type === type.id
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300'
                                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                              }`}
                            >
                              {type.icon}
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Field Selection */}
                      {newFilter.type && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Field
                          </label>
                          <select
                            value={newFilter.field || ''}
                            onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus-ring"
                          >
                            <option value="">Select field...</option>
                            {getAvailableFields().map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Operator Selection */}
                      {newFilter.field && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Operator
                          </label>
                          <select
                            value={newFilter.operator || ''}
                            onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus-ring"
                          >
                            {getAvailableOperators().map((operator) => (
                              <option key={operator.id} value={operator.id}>
                                {operator.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Value Input */}
                      {newFilter.operator && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Value
                          </label>
                          {renderValueInput()}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={addFilter}
                          disabled={!newFilter.field || !newFilter.value}
                        >
                          Add Filter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddFilter(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default AdvancedFilters;
