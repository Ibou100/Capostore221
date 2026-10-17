import React from 'react';
import { Hero } from './Hero';
import { CollectionsGrid } from './CollectionsGrid';
import { NewArrivals } from './NewArrivals';
import { EditorialManifesto } from './EditorialManifesto';
import { PopularSection } from './PopularSection';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Distinct Visual Collections (Homme, Femme, Lunettes, Chaussures, Accessoires) */}
      <CollectionsGrid />

      {/* 3. Nouveautés Recentes Grid */}
      <NewArrivals />

      {/* 4. Editorial Brand Manifesto Block */}
      <EditorialManifesto />

      {/* 5. Curated Popular Products Selection */}
      <PopularSection />

      {/* 6. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
