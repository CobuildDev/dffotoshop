'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Truck, RotateCcw, Mail, Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">




        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative  overflow-hidden rounded-xl flex items-center justify-center">
                <Image
                  src="/site-icon-white.png"
                  alt="Divine Favour Fotoshop Logo"
                  width={150}
                  height={50}
                  className="object-contain p-1"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your one-stop destination in Aba, Abia State for quality photography and videography accessories. Reliable, durable, and affordable gear for all creators.
            </p>
          </div>

          {/* Links Column 1: Store */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Catalog
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">Cameras & Lenses</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tripods & Stands</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Lighting Equipment</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Microphones & Audio</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Storage Devices</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Client Care
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">Store Location (Aba)</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>


        </div>
        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Divine Favour Fotoshop. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Cookie Preferences</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
