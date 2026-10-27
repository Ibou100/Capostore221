import React from 'react';
import { Hero } from './Hero';
import { TerangaServices } from './TerangaServices';
import { CollectionsGrid } from './CollectionsGrid';
import { NewArrivals } from './NewArrivals';
import { EditorialManifesto } from './EditorialManifesto';
import { NewsletterSection } from './NewsletterSection';

export const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      {/* 1. Hero Section - Warm, African, Simple with 100% Real Client Photos */}
      <Hero />

      {/* 2. Teranga Dakar Reassurances (Livraison 24h, WhatsApp, Wave/OM, Essayage) */}
      <TerangaServices />

      {/* 3. 3 Real Departments (Vêtements, Lunettes, Accessoires) */}
      <CollectionsGrid />

      {/* 4. Complete Real Catalog with Instant Filter Pills */}
      <NewArrivals />

      {/* 5. Editorial African Identity & Teranga Dakar */}
      <EditorialManifesto />

      {/* 6. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
};
