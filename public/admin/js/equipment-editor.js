await import('./equipment-editor-core.js?v=4&av2=20260828&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df');
await import('./equipment-attribute-assistant.js?v=9&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df');


const { initAdminLocalImageImport } = await import(
  './admin-ai-image-import.js?v=20260828-hero-ocr-3&nocr=20260828-paddle-browser-v3&parser=20260828-hero-ocr-5&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df'
);
await initAdminLocalImageImport({ entityType: 'equipment' });
