'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { WooProduct } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { submitReview } from '@/app/actions/submitReview';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" disabled={pending} className="px-8 py-3 rounded-xl bg-[#18AD00] hover:bg-[#159a00] shadow-subtle-sm font-bold text-white disabled:opacity-50">
      {pending ? 'Submitting...' : 'Submit Review'}
    </Button>
  );
}

export const ProductReviews = ({ product }: { product: WooProduct }) => {
  const [state, formAction] = useActionState(submitReview, null);

  const reviews = product.reviews?.nodes || [];
  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || reviews.length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div className="border-t border-slate-200 pt-16">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Customer Reviews</h2>

        {/* Review Summary */}
        <div className="flex items-center gap-4 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'text-[#FF9800] fill-[#FF9800]' : 'text-slate-300'}`} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ))}
          </div>
          <div className="text-lg font-bold text-slate-900">{averageRating.toFixed(1)} out of 5</div>
          <div className="text-slate-500">Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</div>
        </div>

        {/* Comment Form */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Add a Review</h3>
          {state?.message && (
            <div className={`mb-4 p-4 rounded-xl ${state.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
              {state.message}
            </div>
          )}
          <form action={formAction} className="space-y-4 max-w-2xl">
            <input type="hidden" name="databaseId" value={product.databaseId} />
            <input type="hidden" name="slug" value={product.slug} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="author" placeholder="Your Name *" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required />
              <input type="email" name="authorEmail" placeholder="Your Email *" className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">Rating:</span>
              <select name="rating" className="h-10 px-3 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required defaultValue="5">
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <textarea name="content" rows={4} placeholder="Your Review *" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-[#F4F7F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none" required></textarea>
            <SubmitButton />
          </form>
        </div>

        {/* Existing Comments */}
        <div className="space-y-8 max-w-3xl">
          {reviews.length === 0 ? (
            <p className="text-slate-500">There are no reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                    {(review.author?.node?.name || 'A')[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-[15px]">{review.author?.node?.name || 'Anonymous'}</div>
                    {review.date && (
                      <div className="text-slate-400 text-xs">{new Date(review.date).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                {/* Parse HTML since WP comments often come with <p> tags */}
                <div className="text-slate-600 text-[15px] leading-relaxed mt-3" dangerouslySetInnerHTML={{ __html: review.content }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
