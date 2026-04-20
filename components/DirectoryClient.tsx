'use client';

import { useState } from 'react';
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
  const availableStates = Array.from(new Set(initialBrokers.map(b => b.state).filter(Boolean))).sort();
  const availableSpecialties = Array.from(new Set(initialBrokers.flatMap(b => b.fundingTypes || b.fundingSpecialties || []))).sort();
  const availableIndustries = Array.from(new Set(initialBrokers.flatMap(b => b.industries || []))).sort();

  // Filter brokers
  const filteredBrokers = initialBrokers.filter(broker => {
    const matchesSearch =
      broker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.agencyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === '' || broker.state === selectedState;

    const typesToSearch = broker.fundingTypes || broker.fundingSpecialties || [];
    const matchesSpecialty = selectedSpecialty === '' || typesToSearch.includes(selectedSpecialty);

    const industriesToSearch = broker.industries || [];
    const matchesIndustry = selectedIndustry === '' || industriesToSearch.includes(selectedIndustry);

    const matchesUrgency = selectedUrgency === '' || broker.urgencyCategory === selectedUrgency;

    return matchesSearch && matchesState && matchesSpecialty && matchesIndustry && matchesUrgency;
  });

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
