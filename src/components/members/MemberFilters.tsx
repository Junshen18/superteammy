"use client";

interface MemberFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOptions?: string[];
}

const defaultFilters = [
  "All",
  "Core Team",
  "Frontend",
  "Backend",
  "Blockchain",
  "Design",
  "Content",
  "Growth",
  "Community",
];

export function MemberFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  filterOptions,
}: MemberFiltersProps) {
  const filters = filterOptions || defaultFilters;

  return (
    <div className="md:space-y-6 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, role, or company..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-5 md:py-3.5 py-2 md:rounded-xl rounded-md bg-surface/50 border border-white/5 text-white placeholder-muted-dark focus:outline-none focus:border-solana-purple/30 focus:ring-1 focus:ring-solana-purple/20 transition-all text-sm"
        />
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 md:w-5 md:h-5 w-4 h-4 text-muted-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide md:overflow-visible md:flex-wrap pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`cursor-pointer shrink-0 px-4 md:py-2.5 py-2 md:rounded-lg rounded-md md:text-sm text-[12px] font-medium transition-all duration-200 whitespace-nowrap ${
              activeFilter === filter
                ? "bg-solana-purple text-white"
                : "bg-surface/50 text-muted hover:text-white hover:bg-surface border border-white/5"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
