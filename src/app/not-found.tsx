import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        
        {/* 404 Image */}
        <div className="relative w-full max-w-[320px] aspect-square mx-auto mb-4">
          <Image
            src="/error-404.png"
            alt="404 Error - Page Not Found"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Page not found
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed max-w-sm mx-auto">
          Oops! It seems the page you're looking for has been moved, deleted, or doesn't exist.
        </p>

        {/* Action Button */}
        <Link href="/" className="inline-block mt-4">
          <Button 
            variant="primary" 
            size="lg"
            className="rounded-xl px-10 py-4 text-base font-bold tracking-wide shadow-subtle-lg hover:shadow-subtle-md"
          >
            Return to Homepage
          </Button>
        </Link>
        
      </div>
    </div>
  );
}
