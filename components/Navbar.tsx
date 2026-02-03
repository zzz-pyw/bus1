import React, { useState } from 'react';
import { CategoryType } from '../types';
import { SearchIcon } from './Icons';

interface NavbarProps {
  currentCategory: CategoryType;
  onCategoryChange: (cat: CategoryType) => void;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentCategory, onCategoryChange, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const tabs: { id: CategoryType; label: string }[] = [
    { id: 'normal', label: '首页' },
    { id: 'uncensored', label: '无码' },
    // { id: 'star', label: '演员' }, 
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onCategoryChange('normal')}>
             <div className="w-8 h-8 bg-[#FB7299] rounded-lg flex items-center justify-center mr-2">
               <span className="text-white font-bold text-lg">B</span>
             </div>
             <span className="text-lg font-bold text-[#FB7299] hidden sm:block">BiliBus</span>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentCategory === tab.id
                    ? 'bg-[#00AEEC] text-white shadow-md shadow-[#00AEEC]/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#00AEEC]" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-[#F4F5F7] text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00AEEC] focus:border-transparent transition-all sm:text-sm"
                placeholder="搜索番号或演员 (支持中文模糊搜)..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          </div>

        </div>
      </div>
      
      {/* Mobile Tabs (Secondary Row) */}
      <div className="md:hidden flex justify-center space-x-2 pb-3 px-4 overflow-x-auto">
         {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onCategoryChange(tab.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${
                currentCategory === tab.id
                  ? 'bg-[#00AEEC] text-white border-[#00AEEC]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
      </div>
    </nav>
  );
};