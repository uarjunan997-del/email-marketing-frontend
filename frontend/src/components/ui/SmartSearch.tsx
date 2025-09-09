import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@components/atoms/Input';
import { Badge } from '@components/atoms/Badge';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp,
  Users,
  Mail
} from 'lucide-react';

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  loading?: boolean;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  value,
  onChange,
  onSearch,
  suggestions = [],
  recentSearches = [],
  loading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allSuggestions = [
    ...recentSearches.map(s => ({ type: 'recent', value: s })),
    ...suggestions.map(s => ({ type: 'suggestion', value: s }))
  ].slice(0, 8);

  // Smart position detection - only show above if there's insufficient space below
  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 280; // Estimated dropdown height
      
      // Only show above if there's insufficient space below AND enough space above
      const shouldShowAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
      
      setDropdownPosition(shouldShowAbove ? 'top' : 'bottom');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const selected = allSuggestions[highlightedIndex];
          onChange(selected.value);
          onSearch(selected.value);
          setIsOpen(false);
        } else {
          onSearch(value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setIsOpen(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary-200 dark:bg-primary-800 text-primary-900 dark:text-primary-100 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Search contacts by name, email, or segment..."
          icon={loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Search className="w-4 h-4" />
            </motion.div>
          ) : (
            <Search className="w-4 h-4" />
          )}
          variant="floating"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            updateDropdownPosition();
            setIsOpen(true);
          }}
          onClick={() => {
            updateDropdownPosition();
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        
        {value && (
          <button
            onClick={() => {
              onChange('');
              onSearch('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (value || allSuggestions.length > 0) && (
          <motion.div
            initial={{ 
              opacity: 0, 
              y: dropdownPosition === 'bottom' ? -10 : 10, 
              scale: 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: dropdownPosition === 'bottom' ? -10 : 10, 
              scale: 0.95 
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden ${
              dropdownPosition === 'bottom' 
                ? 'top-full mt-2' 
                : 'bottom-full mb-2'
            }`}
          >
            {/* Quick filters */}
            {value && (
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  Quick Filters
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20"
                    onClick={() => handleSuggestionClick(`segment:${value}`)}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Segment: {value}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/20"
                    onClick={() => handleSuggestionClick(`email:${value}`)}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Email: {value}
                  </Badge>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {allSuggestions.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                {recentSearches.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1">
                      Recent Searches
                    </p>
                    {recentSearches.slice(0, 3).map((search, index) => (
                      <motion.button
                        key={`recent-${index}`}
                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          highlightedIndex === index 
                            ? 'bg-primary-50 dark:bg-primary-950/20' 
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                        onClick={() => handleSuggestionClick(search)}
                      >
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm">
                          {highlightMatch(search, value)}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1">
                      Suggestions
                    </p>
                    {suggestions.slice(0, 5).map((suggestion, index) => {
                      const adjustedIndex = index + recentSearches.length;
                      return (
                        <motion.button
                          key={`suggestion-${index}`}
                          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            highlightedIndex === adjustedIndex 
                              ? 'bg-primary-50 dark:bg-primary-950/20' 
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <TrendingUp className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm">
                            {highlightMatch(suggestion, value)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* No results */}
            {value && allSuggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No suggestions found for "{value}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;