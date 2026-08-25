// Canonical public share-route foundation for capital.distilledfunding.com/<partner-slug>.
// Rendering delegates to the mature directory profile implementation, which already
// enforces approval/activity/visibility via getBrokerBySlug -> isEligibleForPublicDisplay.
export {
  default,
  generateMetadata,
  generateStaticParams,
  revalidate
} from '../directory/[slug]/page';
