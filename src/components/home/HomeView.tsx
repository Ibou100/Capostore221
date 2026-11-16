import React from 'react';
import { Hero } from './Hero';
import { CollectionsGrid } from './CollectionsGrid';
import { LiveActivityBar } from './LiveActivityBar';
import { NewArrivals } from './NewArrivals';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* 2. Categories */}
      <CollectionsGrid />

      {/* 3. Catalog */}
      <NewArrivals />

      {/* 4. Recent Orders */}
      <LiveActivityBar />

      {/* 5. Contact */}
      <NewsletterSection />
    </div>
  );
};
