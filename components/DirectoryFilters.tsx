'use client';

interface DirectoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  availableStates: string[];
  availableSpecialties: string[];
}

export function DirectoryFilters({
  searchTerm,
  setSearchTerm,
  selectedState,
  setSelectedState,
  selectedSpecialty,
  setSelectedSpecialty,
  availableStates,
  availableSpecialties
}: DirectoryFiltersProps) {
  return (
    <div className="bg-neo-yellow p-6 border-4 border-neo-black shadow-brutal mb-12 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label htmlFor="search" className="block font-bold uppercase text-sm mb-2 text-neo-black">Search Brokers</label>
        <input
          type="text"
          id="search"
          placeholder="Name or Agency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border-2 border-neo-black bg-neo-white font-medium focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-neo-black/50"
        />
      </div>

      <div className="w-full md:w-48">
        <label htmlFor="state" className="block font-bold uppercase text-sm mb-2 text-neo-black">State</label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
        >
          <option value="">All States</option>
          {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="w-full md:w-64">
        <label htmlFor="specialty" className="block font-bold uppercase text-sm mb-2 text-neo-black">Specialty</label>
        <select
          id="specialty"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
        >
          <option value="">All Specialties</option>
          {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
