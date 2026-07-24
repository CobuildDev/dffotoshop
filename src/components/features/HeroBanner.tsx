'use client';

import React from 'react';
import Image from 'next/image';
import { HeroAdvertBanner, MOCK_HERO_BANNER } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface HeroBannerProps {
  bannerData?: HeroAdvertBanner;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  bannerData = MOCK_HERO_BANNER,
  onPrimaryClick,
  onSecondaryClick,
}) => {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-slate-950 text-white shadow-subtle-lg my-6">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src={bannerData.bannerImageUrl}
          alt={bannerData.title}
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Soft gradient overlay for maximum high-contrast text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content Container with Generous Whitespace */}
      <div className="relative z-10 max-w-4xl px-8 py-14 sm:px-12 sm:py-20 flex flex-col items-start gap-6">
        {/* Tagline / Category Pill */}
        {bannerData.tagline && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md shadow-none text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <Text variant="caption" color="inverse" className="tracking-widest">
              {bannerData.tagline}
            </Text>
          </div>
        )}

        {/* Main Headline */}
        <div className="space-y-3 max-w-2xl">
          <Text variant="display" color="inverse" className="font-extrabold tracking-tight">
            {bannerData.title}
          </Text>
          <Text variant="body-lg" className="text-slate-300 font-normal leading-relaxed">
            {bannerData.subtitle}
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            variant="accent"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={onPrimaryClick}
          >
            {bannerData.primaryCtaText}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            onClick={onSecondaryClick}
          >
            {bannerData.secondaryCtaText}
          </Button>
        </div>

        {/* Secondary Note / Offer Badge */}
        {bannerData.badgeText && (
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-2 text-slate-400 text-xs font-medium">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-semibold tracking-wide uppercase text-[10px]">
              {bannerData.badgeText}
            </span>
            {bannerData.offerNote && (
              <span className="text-slate-300">{bannerData.offerNote}</span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
