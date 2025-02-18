import { useState } from 'react';
import { Branch } from '../types/Branch';

interface ContactListProps {
  branches: Branch[];
  searchTerm: string;
  filters: {
    type: string;
    status: string;
    activity: string;
    role: string;
  };
}

type SortOption = 'name' | 'role' | 'branch';

export function ContactList({ branches, searchTerm, filters }: ContactListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Flatten all contacts from all branches
  const contacts = branches.flatMap(branch => 
    branch.branchContacts.map(contact => ({
      ...contact,
      branchName: branch.branchName,
      branchType: branch.branchType,
      branchId: branch.branchId,
      fullName: `${contact.firstName} ${contact.lastName}`.trim()
    }))
  );

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchName = contact.fullName.toLowerCase().includes(searchLower);
        const matchRole = contact.role.toLowerCase().includes(searchLower);
        const matchBranch = contact.branchName.toLowerCase().includes(searchLower);
        if (!matchName && !matchRole && !matchBranch) return false;
      }

      if (filters.role !== 'all' && contact.role !== filters.role) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName, 'nb');
        case 'role':
          return a.role.localeCompare(b.role, 'nb');
        case 'branch':
          return a.branchName.localeCompare(b.branchName, 'nb');
        default:
          return 0;
      }
    });

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-4 mb-6 text-sm font-medium text-[#6b7280] border-b border-gray-200">
        <button
          className={`px-4 py-2 relative ${sortBy === 'name' ? 'text-rc-red' : ''}`}
          onClick={() => setSortBy('name')}
        >
          Navn
          {sortBy === 'name' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-red"></div>
          )}
        </button>
        <button
          className={`px-4 py-2 relative ${sortBy === 'role' ? 'text-rc-red' : ''}`}
          onClick={() => setSortBy('role')}
        >
          Rolle
          {sortBy === 'role' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-red"></div>
          )}
        </button>
        <button
          className={`px-4 py-2 relative ${sortBy === 'branch' ? 'text-rc-red' : ''}`}
          onClick={() => setSortBy('branch')}
        >
          Avdeling
          {sortBy === 'branch' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rc-red"></div>
          )}
        </button>
      </div>

      {/* Contact cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact, index) => (
          <div 
            key={`${contact.branchId}-${index}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-rc-red transition-colors"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#4a4a4a] mb-1">
                  {contact.fullName}
                </h3>
                <div className="text-rc-red font-medium">{contact.role}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{contact.branchName}</span>
                </div>
              </div>

              <div className="space-y-2">
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-[#4a4a4a] hover:text-rc-red transition-colors group"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span className="text-sm truncate">{contact.email}</span>
                  </a>
                )}
                
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-[#4a4a4a] hover:text-rc-red transition-colors group"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span className="text-sm">{contact.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 