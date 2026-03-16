
import React, { useState, useEffect } from 'react';
import { SortOption } from '../types';

interface StoreFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  selectedSort: SortOption;
  setSelectedSort: (sort: SortOption) => void;
  onRefresh: (e?: React.MouseEvent) => void;
  isRefreshing: boolean;
  theme: 'light' | 'dusk' | 'dark' | 'oled';
  placeholder: string;
  onAddApp?: () => void;
  submissionCooldown?: string | null;
  count?: number;
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedSort,
  setSelectedSort,
  onRefresh,
  isRefreshing,
  theme,
  placeholder,
  onAddApp,
  submissionCooldown,
  count
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#category-dropdown')) {
        setIsCategoryDropdownOpen(false);
      }
      if (!target.closest('#sort-dropdown')) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in relative z-20 space-y-4 mb-6">
      {/* Search Bar Row */}
      <div className=" mt-5 relative z-10 flex gap-2">
        <div className="relative flex-1 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-acid via-primary to-neon rounded-2xl opacity-10 group-focus-within:opacity-100 transition duration-500 blur group-focus-within:blur-md"></div>
          <div className="relative flex items-center bg-theme-input rounded-2xl border border-theme-border p-1 shadow-sm transition-all group-focus-within:scale-[1.01] group-focus-within:shadow-lg">
              <div className="pl-4 pr-2 text-theme-sub group-focus-within:text-primary transition-colors">
                  <i className="fas fa-search text-sm"></i>
              </div>
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-theme-text placeholder-gray-500 h-10 font-medium text-sm relative z-10"
              />
              {searchQuery && (
                  <button 
                      onClick={() => setSearchQuery('')} 
                      className="w-8 h-8 flex items-center justify-center text-theme-sub hover:text-red-500 transition-colors outline-none focus:outline-none relative z-10"
                  >
                       <i className="fas fa-times text-xs"></i>
                  </button>
              )}
          </div>
        </div>

        {/* Action Buttons Integrated Row 1 */}
        <div className="flex gap-2">
            <button
                onClick={onRefresh}
                className={`shrink-0 w-12 h-12 rounded-2xl border border-theme-border bg-card flex items-center justify-center text-theme-sub hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95 ${isRefreshing ? 'animate-spin text-primary' : ''}`}
                title="Refresh Data"
            >
                <i className="fas fa-sync-alt text-sm"></i>
            </button>
            {onAddApp && !submissionCooldown && (
                <button
                    onClick={onAddApp}
                    className="shrink-0 w-12 h-12 rounded-2xl border border-theme-border bg-card flex items-center justify-center text-theme-sub hover:text-white hover:bg-primary hover:border-primary transition-all shadow-sm active:scale-95 group"
                    title="Add App"
                >
                    <i className="fas fa-plus text-sm group-hover:rotate-90 transition-transform"></i>
                </button>
            )}
            {submissionCooldown && (
                <div className="shrink-0 w-12 h-12 rounded-2xl border border-theme-border bg-theme-element flex items-center justify-center text-theme-sub opacity-50 cursor-not-allowed">
                    <i className="fas fa-clock text-xs"></i>
                </div>
            )}
        </div>
      </div>

      {/* Horizontal Category Chips */}
      <div className="relative z-10 -mx-6 px-6">
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 snap-x">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all snap-start border active:scale-95 ${
                selectedCategory === category 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-card text-theme-text border-theme-border hover:border-theme-sub'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Stats Row */}
      <div className="flex items-center justify-between relative z-10">
        <div id="sort-dropdown" className="relative w-40">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className={`w-full flex justify-between items-center h-10 px-3 bg-card border rounded-xl font-bold text-[10px] transition-all shadow-sm ${isSortDropdownOpen ? 'border-primary ring-2 ring-primary/10' : 'border-theme-border hover:border-theme-sub'}`}
          >
            <div className="flex items-center gap-2 truncate text-theme-sub uppercase tracking-wider">
                <i className="fas fa-sort-amount-down text-primary"></i>
                <span className="truncate">{selectedSort}</span>
            </div>
            <i className={`fas fa-chevron-${isSortDropdownOpen ? 'up' : 'down'} text-[8px] transition-transform opacity-40 ml-1 shrink-0`}></i>
          </button>

          {isSortDropdownOpen && (
            <ul className="absolute mt-2 w-full bg-card rounded-2xl shadow-2xl border border-theme-border max-h-64 overflow-y-auto z-[60] animate-fade-in no-scrollbar">
              {Object.values(SortOption).map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors text-[11px] flex items-center justify-between first:rounded-t-2xl last:rounded-b-2xl ${
                    selectedSort === option 
                      ? 'font-black text-primary bg-primary/5' 
                      : 'text-theme-text font-medium hover:bg-theme-element'
                  }`}
                >
                  <span>{option}</span>
                  {selectedSort === option && <i className="fas fa-check text-[8px]"></i>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-theme-sub uppercase tracking-widest opacity-60">Library Size</span>
            <div className="h-10 min-w-[3rem] px-3 bg-card border border-theme-border rounded-xl flex items-center justify-center shadow-sm" title="Total Apps">
                <span className="font-black text-primary text-sm">{count || 0}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;
