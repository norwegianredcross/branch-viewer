interface FilterBarProps {
  onFilter: (filters: {
    type: string;
    status: string;
    activity: string;
    role: string;
  }) => void;
  showRoleFilter?: boolean;
}

export function FilterBar({ onFilter, showRoleFilter = false }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {!showRoleFilter && (
        <>
          <select 
            onChange={(e) => onFilter({ type: e.target.value, status: 'active', activity: '', role: 'all' })}
          >
            <option value="all">Alle typer</option>
            <option value="Lokalforening">Lokalforening</option>
            <option value="Distrikt">Distrikt</option>
          </select>

          <select 
            onChange={(e) => onFilter({ type: 'all', status: e.target.value, activity: '', role: 'all' })}
          >
            <option value="active">Aktive</option>
            <option value="terminated">Avsluttet</option>
            <option value="all">Alle status</option>
          </select>
        </>
      )}

      {showRoleFilter && (
        <select 
          onChange={(e) => onFilter({ type: 'all', status: 'active', activity: '', role: e.target.value })}
        >
          <option value="all">Alle roller</option>
          <option value="Leder">Leder</option>
          <option value="Nestleder">Nestleder</option>
          <option value="Webredaktør">Webredaktør</option>
        </select>
      )}
    </div>
  );
} 