// Canonical public share-route foundation for capital.distilledfunding.com/<partner-slug>.
// Static application routes take precedence over this dynamic route. Rendering delegates to
// the mature directory profile implementation, which already enforces public eligibility via
// getBrokerBySlug -> isEligibleForPublicDisplay.
export {
  default,
  generateMetadata,
  generateStaticParams,
  revalidate
} from '../directory/[slug]/page';
