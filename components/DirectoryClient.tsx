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
  const [selectedUrgency, setSelectedUrgency] = useState('');

  // Compute unique filter options
  const availableStates = useMemo(() =>
    Array.from(new Set(initialBrokers.flatMap(b => [b.state, ...(b.serviceArea || [])]).filter(Boolean))).sort(),
  [initialBrokers]);

  const availableSpecialties = useMemo(() =>
    Array.from(new Set(initialBrokers.flatMap(b => b.fundingTypes || b.fundingSpecialties || []))).sort(),
  [initialBrokers]);

  const availableIndustries = useMemo(() =>
    Array.from(new Set(initialBrokers.flatMap(b => b.verticals || b.industries || []))).sort(),
  [initialBrokers]);

  // Filter brokers
  const filteredBrokers = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return initialBrokers.filter(broker => {
      const matchesSearch =
        broker.fullName.toLowerCase().includes(lowerSearchTerm) ||
        broker.agencyName.toLowerCase().includes(lowerSearchTerm);

      const matchesState = selectedState === '' || broker.state === selectedState || (broker.serviceArea && broker.serviceArea.includes(selectedState));

      const typesToSearch = broker.fundingTypes || broker.fundingSpecialties || [];
      const matchesSpecialty = selectedSpecialty === '' || typesToSearch.includes(selectedSpecialty);

      const industriesToSearch = broker.verticals || broker.industries || [];
      const matchesIndustry = selectedIndustry === '' || industriesToSearch.includes(selectedIndustry);

      const matchesUrgency = selectedUrgency === '' || broker.urgencyCategory === selectedUrgency || broker.speedToContact === selectedUrgency;

      return matchesSearch && matchesState && matchesSpecialty && matchesIndustry && matchesUrgency;
    });
  }, [initialBrokers, searchTerm, selectedState, selectedSpecialty, selectedIndustry, selectedUrgency]);

  const isAnyFilterActive = searchTerm !== '' || selectedState !== '' || selectedSpecialty !== '' || selectedIndustry !== '' || selectedUrgency !== '';
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedSpecialty('');
    setSelectedIndustry('');
    setSelectedUrgency('');
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <DirectoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedUrgency={selectedUrgency}
        setSelectedUrgency={setSelectedUrgency}
        availableStates={availableStates}
        availableSpecialties={availableSpecialties}
        availableIndustries={availableIndustries}
      />

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neo-cream p-4 border-2 border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div aria-live="polite" className="font-bold uppercase tracking-wider">
          Showing {filteredBrokers.length} partner{filteredBrokers.length !== 1 ? 's' : ''}
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
          <h3 className="text-3xl font-black uppercase mb-4">No partners found</h3>
          <p className="font-medium text-lg">Try adjusting your filters to see more results.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedState(''); setSelectedSpecialty(''); setSelectedIndustry(''); setSelectedUrgency(''); }}
            className="btn-brutal-primary mt-8"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBrokers.map(broker => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      )}
    </div>
  );
}
