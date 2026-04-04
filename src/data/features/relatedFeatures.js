import { getFeaturePage } from '../../lib/getLocaleContent.js';
import { featurePages } from './index.js';

const localizeFeature = (feature, locale = 'de') => {
  if (!feature?.slug) return feature ?? null;
  const localizedFeature = getFeaturePage(feature.slug, locale);
  if (!localizedFeature) return feature;
  return { ...localizedFeature, slug: feature.slug };
};

const toTagSet = (feature) => {
  if (!feature || !Array.isArray(feature.tags)) return new Set();
  return new Set(
    feature.tags
      .map((tag) => String(tag || '').trim().toLowerCase())
      .filter(Boolean),
  );
};

const calcOverlap = (sourceTags, targetTags) => {
  let overlap = 0;
  sourceTags.forEach((tag) => {
    if (targetTags.has(tag)) overlap += 1;
  });
  return overlap;
};

/**
 * Returns a deterministic, tag-based set of related features for one feature page.
 *
 * Ranking:
 * 1) more shared tags
 * 2) shorter tag distance
 * 3) slug alphabetical (stable)
 */
export const getRelatedFeaturesFor = (currentSlug, { limit = 6, locale = 'de' } = {}) => {
  const currentFeature = featurePages[currentSlug];
  if (!currentFeature) return [];

  const sourceTags = toTagSet(currentFeature);
  const curatedRelatedSlugs = Array.isArray(currentFeature.relatedFeatures)
    ? currentFeature.relatedFeatures
    : [];

  const candidates = Object.values(featurePages)
    .filter((feature) => feature && feature.slug && feature.slug !== currentSlug)
    .map((feature) => {
      const tags = toTagSet(feature);
      const overlap = calcOverlap(sourceTags, tags);
      const tagDistance = Math.abs(sourceTags.size - tags.size);
      return { feature, overlap, tagDistance };
    });

  const bySlug = new Map(candidates.map((item) => [item.feature.slug, item]));

  // 1) Always prefer manually curated relations first.
  const curatedRelated = curatedRelatedSlugs
    .map((slug) => bySlug.get(slug)?.feature)
    .filter(Boolean);

  // 2) Fill with strong tag matches only (>= 2 shared tags).
  const tagRanked = candidates
    .filter((item) => item.overlap >= 2)
    .sort((a, b) => (
      (b.overlap - a.overlap)
      || (a.tagDistance - b.tagDistance)
      || a.feature.slug.localeCompare(b.feature.slug, 'de')
    ))
    .map((item) => item.feature);

  const seen = new Set();
  const merged = [...curatedRelated, ...tagRanked].filter((feature) => {
    if (seen.has(feature.slug)) return false;
    seen.add(feature.slug);
    return true;
  });

  if (merged.length >= limit) {
    return merged
      .slice(0, limit)
      .map((feature) => localizeFeature(feature, locale))
      .filter(Boolean);
  }

  // 3) Fallback if still not enough (stable + deterministic).
  const existingSlugs = new Set(merged.map((feature) => feature.slug));
  const fallback = candidates
    .filter((item) => !existingSlugs.has(item.feature.slug))
    .sort((a, b) => a.feature.slug.localeCompare(b.feature.slug, 'de'))
    .map((item) => item.feature);

  return [...merged, ...fallback]
    .slice(0, limit)
    .map((feature) => localizeFeature(feature, locale))
    .filter(Boolean);
};

export const getAllFeaturesForSlider = (locale = 'de') => Object.keys(featurePages)
  .map((slug) => localizeFeature(featurePages[slug], locale))
  .filter(Boolean);
