export const sitename = 'Apartly';
export const siteurl = 'https://apartly.com';

const imgs = 'https://wqyqougnnqwgqhjshpvz.supabase.co/storage/v1/object/public/apartments_images/';
export const getPreviewUrl = (uid: string) => `${imgs}${uid}/preview`;
