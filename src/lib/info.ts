export const sitename = 'Apartly';
export const siteurl = 'https://apartly.com';

const imgs = 'https://wqyqougnnqwgqhjshpvz.supabase.co/storage/v1/object/public/apartments_images/';
export const getPreviewUrl = (uid: string, appt_id: number) => `${imgs}${uid}/${appt_id}/preview`;
