'use client';

import { useState, useEffect } from 'react';
import { BrokerProfile } from '@/lib/types';
import { getBrokers } from '@/lib/brokers';
import { BrokerCard } from '@/components/BrokerCard';
import { DirectoryFilters } from '@/components/DirectoryFilters';
import { CTASection } from '@/components/CTASection';
import { SectionHeading } from '@/components/SectionHeading';

export default function DirectoryPage() {
  const [brokers, setBrokers] = useState<BrokerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrokers() {
      const data = await getBrokers();
      setBrokers(data);
      setLoading(false);
    }
    loadBrokers();
  }, []);

  // Compute unique filter options
  const availableStates = Array.from(new Set(brokers.map(b => b.state))).sort();
  const availableSpecialties = Array.from(new Set(brokers.flatMap(b => b.fundingSpecialties))).sort();

  // Filter brokers
  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch =
      broker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.agencyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === '' || broker.state === selectedState;

    const matchesSpecialty = selectedSpecialty === '' || broker.fundingSpecialties.includes(selectedSpecialty);

    return matchesSearch && matchesState && matchesSpecialty;
  });

  return (
    <div className="bg-neo-white min-h-screen text-neo-black">
      <div className="bg-neo-black text-neo-white py-16 px-6 md:px-12 border-b-4 border-neo-green">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Partner Directory</h1>
          <p className="text-xl md:text-2xl font-medium text-neo-cream/90 max-w-2xl">
            Find the right capital partner for your next move.
          </p>
        </div>
      </div>

      <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        <DirectoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          availableStates={availableStates}
          availableSpecialties={availableSpecialties}
        />

        {loading ? (
          <div className="py-24 text-center font-black text-2xl uppercase tracking-widest text-neo-black/40 animate-pulse">
            Loading Partners...
          </div>
        ) : filteredBrokers.length === 0 ? (
          <div className="bg-neo-cream border-4 border-neo-black p-12 text-center shadow-brutal">
            <h3 className="text-3xl font-black uppercase mb-4">No partners found</h3>
            <p className="font-medium text-lg">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedState(''); setSelectedSpecialty(''); }}
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

      <CTASection />
    </div>
  );
}
