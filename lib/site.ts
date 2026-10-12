export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.spacewallah.com').replace(/\/$/, '');
export const SITE_NAME = 'SpaceWallah';
export const abs = (path: string) => `${SITE_URL}${path}`;
