import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(relativePath, data) {
  const filePath = path.join(root, relativePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

console.log('--- Repairing Registry Files ---');

// 1. Load files
const pagesData = readJson('data/pages/funding-pages.registry.json');
const familiesData = readJson('data/funding/funding-product-families.registry.json');
const productsData = readJson('data/funding/funding-products.registry.json');
const providersData = readJson('data/funding/funding-providers.registry.json');
const toolsData = readJson('data/embeds/tool-registry.json');

// 2. Task 2: Remove deprecated `structured-growth-loans` from public page refs and public related-lane refs
if (Array.isArray(pagesData.pages)) {
  pagesData.pages.forEach((page) => {
    if (page.sections && Array.isArray(page.sections)) {
      page.sections.forEach((section) => {
        if (Array.isArray(section.itemIds)) {
          section.itemIds = section.itemIds.filter((id) => id !== 'structured-growth-loans');
        }
      });
    }
    if (page.dataRefs && Array.isArray(page.dataRefs.productFamilyIds)) {
      page.dataRefs.productFamilyIds = page.dataRefs.productFamilyIds.filter((id) => id !== 'structured-growth-loans');
    }
  });
}

// Task 2 (cont): Remove `structured-growth-loans` from public tool relatedFamilyIds if present
const toolsList = toolsData.tools || toolsData.entries || [];
toolsList.forEach((tool) => {
  if (tool.relatedFamilyIds && Array.isArray(tool.relatedFamilyIds)) {
    if (tool.visibility === 'public' || tool.accessLevel === 'public') {
      tool.relatedFamilyIds = tool.relatedFamilyIds.filter((id) => id !== 'structured-growth-loans');
    }
  }
});

// 3. Task 3: Keep `structured-growth-loans` family record as internal/deprecated only
// Checked: in familiesData.entries, structured-growth-loans has status="deprecated", visibility="internal", deprecated=true.

// 4. Task 4: Recalculate `funding-products.registry.json.familyCounts` from actual product entries
const familyCounts = {};
if (Array.isArray(productsData.entries)) {
  productsData.entries.forEach((product) => {
    if (product.productFamily) {
      familyCounts[product.productFamily] = (familyCounts[product.productFamily] || 0) + 1;
    }
  });
}
productsData.familyCounts = familyCounts;

// 5. Task 5 & 6 & 7: Providers
// First, find map of providerId -> Set of productFamily from products
const productFamiliesByProvider = {};
if (Array.isArray(productsData.entries)) {
  productsData.entries.forEach((product) => {
    if (!product.providerId) return;
    if (!productFamiliesByProvider[product.providerId]) {
      productFamiliesByProvider[product.providerId] = new Set();
    }
    if (product.productFamily) {
      productFamiliesByProvider[product.providerId].add(product.productFamily);
    }
  });
}

// Add provider stubs for missing providerId
const existingProviderIds = new Set(providersData.entries.map((p) => p.id));

if (Array.isArray(productsData.entries)) {
  productsData.entries.forEach((product) => {
    if (product.needsReview && Array.isArray(product.needsReview)) {
      product.needsReview = product.needsReview.filter((r) => !r.includes('providerId not yet in funding-providers.registry'));
      if (product.needsReview.length === 0) {
        delete product.needsReview;
      }
    }
  });
}

for (const [providerId, familiesSet] of Object.entries(productFamiliesByProvider)) {
  if (!existingProviderIds.has(providerId)) {
    const providerProducts = productsData.entries.filter((p) => p.providerId === providerId);
    const providerName = providerProducts[0]?.providerName || providerId;
    const stub = {
      id: providerId,
      slug: providerId,
      name: providerName,
      categories: ['Business'],
      productFamilyIds: Array.from(familiesSet).sort(),
      financingProducts: providerProducts.map((p) => p.fundingType || p.name).filter(Boolean),
      geographicCoverage: ['US'],
      industryAppetite: [],
      restrictedIndustries: [],
      typicalBorrowerProfile: 'Standard commercial applicant',
      eligibility: {
        minCreditScore: providerProducts[0]?.minCreditScore ?? null,
        minMonthlyRevenue: providerProducts[0]?.minMonthlyRevenue ?? null,
        minTimeInBusinessMonths: providerProducts[0]?.minTimeInBusinessMonths ?? null,
      },
      requirements: {
        pgType: null,
        disqualifiers: null,
        requirementsNote: null,
      },
      terms: {
        fundingAmountText: null,
      },
      affiliate: {
        affiliateStatus: 'pending',
        directory: [],
        affiliateUrl: null,
        applyUrl: null,
        commissionRate: null,
        contactEmail: null,
        keyContact: null,
        website: null,
      },
      source: {
        derivedFrom: 'Generated from product references',
        verificationStatus: 'needs_review',
        lastVerified: new Date().toISOString().split('T')[0],
        notes: ['Auto-generated provider stub for missing product providerId'],
      },
      needsReview: ['auto_generated_stub'],
    };
    providersData.entries.push(stub);
    existingProviderIds.add(providerId);
  }
}

// Rebuild provider productFamilyIds
providersData.entries.forEach((provider) => {
  // Preserve manually curated provider family IDs only if still valid and not deprecated ('structured-growth-loans')
  const validCurated = (provider.productFamilyIds || []).filter((f) => f !== 'structured-growth-loans');
  const fromProducts = Array.from(productFamiliesByProvider[provider.id] || []);
  provider.productFamilyIds = Array.from(new Set([...validCurated, ...fromProducts])).sort();
});

// 6. Task 8: Populate each funding family's relatedProductIds by matching products where productFamily equals family id
const productsByFamily = {};
if (Array.isArray(productsData.entries)) {
  productsData.entries.forEach((product) => {
    if (product.productFamily) {
      if (!productsByFamily[product.productFamily]) {
        productsByFamily[product.productFamily] = [];
      }
      productsByFamily[product.productFamily].push(product.id);
    }
  });
}

if (Array.isArray(familiesData.entries)) {
  familiesData.entries.forEach((family) => {
    family.relatedProductIds = productsByFamily[family.id] || [];
  });
}

// Write repaired data back to disk
writeJson('data/pages/funding-pages.registry.json', pagesData);
writeJson('data/funding/funding-product-families.registry.json', familiesData);
writeJson('data/funding/funding-products.registry.json', productsData);
writeJson('data/funding/funding-providers.registry.json', providersData);
writeJson('data/embeds/tool-registry.json', toolsData);

console.log('--- Registry Files Repaired and Written ---');
