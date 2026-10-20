'use client';

import { useState, useMemo } from 'react';
import { BrokerProfile } from '@/lib/types';
import { BrokerCard } from '@/components/BrokerCard';
import { DirectoryFilters } from '@/components/DirectoryFilters';

interface DirectoryClientProps {
  initialBrokers: BrokerProfile[];
}

export function DirectoryClient({ initialBrokers }: DirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Compute unique filter options
  const availableStates = useMemo(() =>
    Array.from(new Set(initialBrokers.map(b => b.state).filter(Boolean))).sort(),
  [initialBrokers]);

  const availableSpecialties = useMemo(() =>
    Array.from(new Set(initialBrokers.flatMap(b => b.fundingTypes?.length ? b.fundingTypes : b.fundingSpecialties || []))).sort(),
  [initialBrokers]);

  const availableIndustries = useMemo(() =>
    Array.from(new Set(initialBrokers.flatMap(b => b.industries || []))).sort(),
  [initialBrokers]);

  // Filter brokers
  const filteredBrokers = useMemo(() => {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    return initialBrokers.filter(broker => {
      const searchableNames = [broker.displayName, broker.fullName, broker.companyName, broker.agencyName]
        .filter(Boolean)
        .map((value) => value!.toLowerCase());
      const matchesSearch = !lowerSearchTerm || searchableNames.some((value) => value.includes(lowerSearchTerm));

      const matchesState = selectedState === '' || broker.state === selectedState;

      const typesToSearch = broker.fundingTypes?.length ? broker.fundingTypes : broker.fundingSpecialties || [];
      const matchesSpecialty = selectedSpecialty === '' || typesToSearch.includes(selectedSpecialty);

      const industriesToSearch = broker.industries || [];
      const matchesIndustry = selectedIndustry === '' || industriesToSearch.includes(selectedIndustry);

      return matchesSearch && matchesState && matchesSpecialty && matchesIndustry;
    });
  }, [initialBrokers, searchTerm, selectedState, selectedSpecialty, selectedIndustry]);

  const isAnyFilterActive = searchTerm !== '' || selectedState !== '' || selectedSpecialty !== '' || selectedIndustry !== '';
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedSpecialty('');
    setSelectedIndustry('');
  };

  return (
    <div className="py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <DirectoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        availableStates={availableStates}
        availableSpecialties={availableSpecialties}
        availableIndustries={availableIndustries}
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 bg-neo-cream p-3 border-2 border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div aria-live="polite" className="font-bold uppercase tracking-wider">
          Showing {filteredBrokers.length} advisor{filteredBrokers.length !== 1 ? 's' : ''}
        </div>
        {isAnyFilterActive && (
          <button
            onClick={clearFilters}
            aria-label="Clear all filters"
            className="text-xs font-black uppercase tracking-wider bg-neo-red text-neo-white border-2 border-neo-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:translate-x-px hover:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-neo-black"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredBrokers.length === 0 ? (
        <div className="bg-neo-cream border-4 border-neo-black p-12 text-center shadow-brutal">
          <h3 className="text-3xl font-black uppercase mb-4">No advisors found</h3>
          <p className="font-medium text-lg">Try a different name, company, state, industry, or funding specialty.</p>
          <button
            onClick={clearFilters}
            className="btn-brutal-primary mt-8"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBrokers.map(broker => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      )}
    </div>
  );
}
