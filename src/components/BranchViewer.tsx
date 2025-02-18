import React from 'react';
import { Branch } from '../types/Branch';
import { BranchList } from './BranchList';
import { BranchMap } from './BranchMap';
import { ContactList } from './ContactList';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { mockData } from '../mockData';

type ViewMode = 'list' | 'map' | 'contacts';

export function BranchViewer() {
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    type: 'all',
    status: 'active',
    activity: '',
    role: 'all',
  });

  React.useEffect(() => {
    setTimeout(() => {
      setBranches(mockData.data.branches);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
          >
            Avdelinger
          </Button>
          <Button
            variant={viewMode === 'contacts' ? 'default' : 'ghost'}
            onClick={() => setViewMode('contacts')}
          >
            Kontakter
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'ghost'}
            onClick={() => setViewMode('map')}
          >
            Kart
          </Button>
        </div>

        <Input
          placeholder={viewMode === 'contacts' ? 'Søk etter kontakter...' : 'Søk etter avdelinger...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-4">
          {!viewMode.includes('contacts') ? (
            <>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle typer</SelectItem>
                  <SelectItem value="Lokalforening">Lokalforening</SelectItem>
                  <SelectItem value="Distrikt">Distrikt</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktive</SelectItem>
                  <SelectItem value="terminated">Avsluttet</SelectItem>
                  <SelectItem value="all">Alle status</SelectItem>
                </SelectContent>
              </Select>
            </>
          ) : (
            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({ ...filters, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle roller</SelectItem>
                <SelectItem value="Leder">Leder</SelectItem>
                <SelectItem value="Nestleder">Nestleder</SelectItem>
                <SelectItem value="Webredaktør">Webredaktør</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {viewMode === 'list' && (
        <BranchList 
          branches={branches} 
          searchTerm={searchTerm}
          filters={filters}
        />
      )}
      {viewMode === 'contacts' && (
        <ContactList 
          branches={branches}
          searchTerm={searchTerm}
          filters={filters}
        />
      )}
      {viewMode === 'map' && (
        <BranchMap 
          branches={branches}
          searchTerm={searchTerm}
          filters={filters}
        />
      )}
    </div>
  );
} 