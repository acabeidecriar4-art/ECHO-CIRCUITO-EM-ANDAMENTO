// Compatibilidade para o validador legado de heróis.
// O módulo original resolve './js/admin-shell.js?pgv=82901afbc8df' a partir de admin/js/;
// este bridge mantém o fluxo funcional sem duplicar a implementação do Shell.
export * from '../admin-shell.js?v=20260823-promo-nav-1&sb=20260823-security-supabase-pin-1&pgv=82901afbc8df';
