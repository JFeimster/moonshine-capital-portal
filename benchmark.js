const { performance } = require('perf_hooks');

const initialBrokers = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i),
  state: ['CA', 'NY', 'TX', 'FL', 'IL'][i % 5],
  fundingTypes: [['Type A', 'Type B'], ['Type C'], ['Type A']][i % 3],
  industries: [['Tech', 'Finance'], ['Retail'], ['Real Estate']][i % 3],
  fullName: `Broker ${i}`,
  agencyName: `Agency ${i}`,
  urgencyCategory: ['High', 'Medium', 'Low'][i % 3],
}));

function computeUnoptimized() {
  const availableStates = Array.from(new Set(initialBrokers.map(b => b.state).filter(Boolean))).sort();
  const availableSpecialties = Array.from(new Set(initialBrokers.flatMap(b => b.fundingTypes || b.fundingSpecialties || []))).sort();
  const availableIndustries = Array.from(new Set(initialBrokers.flatMap(b => b.industries || []))).sort();

  const searchTerm = 'Broker';
  const lowerSearchTerm = searchTerm.toLowerCase();
  const selectedState = 'CA';
  const selectedSpecialty = 'Type A';
  const selectedIndustry = 'Tech';
  const selectedUrgency = '';

  const filteredBrokers = initialBrokers.filter(broker => {
    const matchesSearch =
      broker.fullName.toLowerCase().includes(lowerSearchTerm) ||
      broker.agencyName.toLowerCase().includes(lowerSearchTerm);

    const matchesState = selectedState === '' || broker.state === selectedState;

    const typesToSearch = broker.fundingTypes || broker.fundingSpecialties || [];
    const matchesSpecialty = selectedSpecialty === '' || typesToSearch.includes(selectedSpecialty);

    const industriesToSearch = broker.industries || [];
    const matchesIndustry = selectedIndustry === '' || industriesToSearch.includes(selectedIndustry);

    const matchesUrgency = selectedUrgency === '' || broker.urgencyCategory === selectedUrgency;

    return matchesSearch && matchesState && matchesSpecialty && matchesIndustry && matchesUrgency;
  });

  return filteredBrokers.length;
}

const RUNS = 10000;

console.log("Running unoptimized benchmark...");
const startUnopt = performance.now();
for (let i = 0; i < RUNS; i++) {
  computeUnoptimized();
}
const endUnopt = performance.now();
console.log(`Unoptimized took: ${(endUnopt - startUnopt).toFixed(2)}ms for ${RUNS} iterations`);

// Optimized computation (simulating what happens on re-render when dependencies haven't changed)
let cachedStates, cachedSpecialties, cachedIndustries, cachedFiltered;
function computeOptimized() {
  if (!cachedStates) {
     cachedStates = Array.from(new Set(initialBrokers.map(b => b.state).filter(Boolean))).sort();
     cachedSpecialties = Array.from(new Set(initialBrokers.flatMap(b => b.fundingTypes || b.fundingSpecialties || []))).sort();
     cachedIndustries = Array.from(new Set(initialBrokers.flatMap(b => b.industries || []))).sort();
  }

  // Also simulating memoizing filteredBrokers if dependencies don't change
  // For the sake of this benchmark let's say filter dependencies change every time
  // Wait, if filter dependencies change, we still filter. If they don't, we don't.
  // We'll just assume they change, so we only save on filter options computation.

  const searchTerm = 'Broker';
  const lowerSearchTerm = searchTerm.toLowerCase();
  const selectedState = 'CA';
  const selectedSpecialty = 'Type A';
  const selectedIndustry = 'Tech';
  const selectedUrgency = '';

  const filteredBrokers = initialBrokers.filter(broker => {
    const matchesSearch =
      broker.fullName.toLowerCase().includes(lowerSearchTerm) ||
      broker.agencyName.toLowerCase().includes(lowerSearchTerm);

    const matchesState = selectedState === '' || broker.state === selectedState;

    const typesToSearch = broker.fundingTypes || broker.fundingSpecialties || [];
    const matchesSpecialty = selectedSpecialty === '' || typesToSearch.includes(selectedSpecialty);

    const industriesToSearch = broker.industries || [];
    const matchesIndustry = selectedIndustry === '' || industriesToSearch.includes(selectedIndustry);

    const matchesUrgency = selectedUrgency === '' || broker.urgencyCategory === selectedUrgency;

    return matchesSearch && matchesState && matchesSpecialty && matchesIndustry && matchesUrgency;
  });
  return filteredBrokers.length;
}

console.log("Running optimized benchmark (memoized options)...");
const startOpt = performance.now();
for (let i = 0; i < RUNS; i++) {
  computeOptimized();
}
const endOpt = performance.now();
console.log(`Optimized took: ${(endOpt - startOpt).toFixed(2)}ms for ${RUNS} iterations`);
