'use client';

interface DirectoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  availableStates: string[];
  availableSpecialties: string[];
  availableIndustries: string[];
}

export function DirectoryFilters({
  searchTerm,
  setSearchTerm,
  selectedState,
  setSelectedState,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedIndustry,
  setSelectedIndustry,
  availableStates,
  availableSpecialties,
  availableIndustries
}: DirectoryFiltersProps) {
  return (
    <div className="bg-neo-yellow p-6 border-4 border-neo-black shadow-brutal mb-12 flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
        <div className="flex-1 w-full">
          <label htmlFor="search" className="block font-bold uppercase text-sm mb-2 text-neo-black">Search advisors or companies</label>
          <input
            type="text"
            id="search"
            placeholder="Name or company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 border-neo-black bg-neo-white p-3 font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] placeholder:text-neo-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue"
          />
        </div>

        <div className="w-full md:w-48">
          <label htmlFor="state" className="block font-bold uppercase text-sm mb-2 text-neo-black">State</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full appearance-none rounded-none border-2 border-neo-black bg-neo-white p-3 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue"
          >
            <option value="">All States</option>
            {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="w-full">
          <label htmlFor="industry" className="block font-bold uppercase text-sm mb-2 text-neo-black">Industry</label>
          <select
            id="industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full appearance-none rounded-none border-2 border-neo-black bg-neo-white p-3 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue"
          >
            <option value="">All Industries</option>
            {availableIndustries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="specialty" className="block font-bold uppercase text-sm mb-2 text-neo-black">Funding Type</label>
          <select
            id="specialty"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full appearance-none rounded-none border-2 border-neo-black bg-neo-white p-3 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neo-blue"
          >
            <option value="">All Types</option>
            {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

      </div>
    </div>
  );
}
