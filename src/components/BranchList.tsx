import React from 'react';
import { Branch } from '../types/Branch';
import { BranchCard } from './BranchCard';

interface BranchListProps {
  branches: Branch[];
  searchTerm: string;
  filters: {
    type: string;
    status: string;
    activity: string;
  };
}

export function BranchList({ branches, searchTerm, filters }: BranchListProps) {
  const filteredBranches = branches.filter(branch => {
    // Filter by search term
    if (searchTerm && !branch.branchName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by type
    if (filters.type !== 'all' && branch.branchType !== filters.type) {
      return false;
    }

    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !branch.branchStatus.isActive) {
        return false;
      }
      if (filters.status === 'terminated' && !branch.branchStatus.isTerminated) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="branch-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredBranches.map(branch => (
        <BranchCard key={branch.branchId} branch={branch} />
      ))}
    </div>
  );
} 