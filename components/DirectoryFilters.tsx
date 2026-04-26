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
  selectedUrgency: string;
  setSelectedUrgency: (urgency: string) => void;
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
  selectedUrgency,
  setSelectedUrgency,
  availableStates,
  availableSpecialties,
  availableIndustries
}: DirectoryFiltersProps) {
  return (
    <div className="bg-neo-yellow p-6 border-4 border-neo-black shadow-brutal mb-12 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
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
          <label htmlFor="state" className="block font-bold uppercase text-sm mb-2 text-neo-black">State / Service Area</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
          >
            <option value="">All Areas</option>
            {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <label htmlFor="industry" className="block font-bold uppercase text-sm mb-2 text-neo-black">Industry</label>
          <select
            id="industry"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
          >
            <option value="">All Industries</option>
            {availableIndustries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="w-full md:flex-1">
          <label htmlFor="specialty" className="block font-bold uppercase text-sm mb-2 text-neo-black">Funding Type</label>
          <select
            id="specialty"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
          >
            <option value="">All Types</option>
            {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="w-full md:flex-1">
          <label htmlFor="urgency" className="block font-bold uppercase text-sm mb-2 text-neo-black">Urgency / Speed</label>
          <select
            id="urgency"
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full p-3 border-2 border-neo-black bg-neo-white font-bold focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] appearance-none rounded-none"
          >
            <option value="">Any Speed</option>
            <option value="fast">Fast (0-48h)</option>
            <option value="standard">Standard (2-5d)</option>
            <option value="complex">Complex (1w+)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
