import React from 'react';
import { Hero } from './Hero';
import { TerangaServices } from './TerangaServices';
import { CollectionsGrid } from './CollectionsGrid';
import { LiveActivityBar } from './LiveActivityBar';
import { NewArrivals } from './NewArrivals';
import { EditorialManifesto } from './EditorialManifesto';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* 2. Reassurances & Operating Model */}
      <TerangaServices />

      {/* 3. 3 Core Departments */}
      <CollectionsGrid />

      {/* 3b. Live Orders Activity Bar */}
      <LiveActivityBar />

      {/* 4. Complete Catalog */}
      <NewArrivals />

      {/* 5. Editorial Manifesto */}
      <EditorialManifesto />

      {/* 6. Newsletter & Contact */}
      <NewsletterSection />
    </div>
  );
};
