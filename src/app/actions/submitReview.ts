'use server';

import { graphqlClient } from '@/lib/graphqlClient';
import { SUBMIT_REVIEW_MUTATION } from '@/lib/queries';
import { revalidatePath } from 'next/cache';

export async function submitReview(prevState: any, formData: FormData) {
  const databaseId = Number(formData.get('databaseId'));
  const author = formData.get('author') as string;
  const authorEmail = formData.get('authorEmail') as string;
  const content = formData.get('content') as string;
  const rating = Number(formData.get('rating'));
  const slug = formData.get('slug') as string;

  if (!databaseId || !author || !authorEmail || !content || !rating || !slug) {
    return { success: false, message: 'All fields are required.' };
  }

  try {
    await graphqlClient.request(SUBMIT_REVIEW_MUTATION, {
      commentOn: databaseId,
      author,
      authorEmail,
      content,
      rating,
    });

    revalidatePath(`/product/${slug}`);
    return { success: true, message: 'Your review was submitted successfully.' };
  } catch (error: any) {
    console.error('Failed to submit review:', error);
    return { success: false, message: error.message || 'Failed to submit review. Please try again later.' };
  }
}
