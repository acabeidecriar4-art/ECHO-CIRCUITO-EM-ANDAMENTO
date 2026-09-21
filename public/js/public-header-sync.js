import './public-beta-banner.js?v=20260822-beta-1&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df';
const wrapperParams = new URL(import.meta.url).searchParams;
const coreUrl = new URL('./public-header-sync-core.js?v=20260822-public-header-core-3&sb=20260823-security-supabase-pin-1&identity=20260825-v6-public-1&pgv=82901afbc8df', import.meta.url);
coreUrl.searchParams.set('active', wrapperParams.get('active') || '');
coreUrl.searchParams.set('mode', wrapperParams.get('mode') || 'site-shell');
await import(coreUrl.href);
