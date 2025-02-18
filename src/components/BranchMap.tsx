import { Branch } from '../types/Branch';

interface BranchMapProps {
  branches: Branch[];
  searchTerm: string;
  filters: {
    type: string;
    status: string;
    activity: string;
  };
}

export function BranchMap(_props: BranchMapProps) {
  return (
    <div className="branch-map">
      <p className="p-4">Map view coming soon...</p>
    </div>
  );
} 