import { supabase } from './supabase.js?v=20260823-security-supabase-pin-1&pgv=82901afbc8df';
import { createPromoCodeController } from './promo-gift-controller.mjs?v=20260828-promo-gift-5&pgv=82901afbc8df';

let controller;

async function loadPromoCodeBanner() {
  if (!controller) controller = createPromoCodeController({client:supabase});
  return controller.load();
}

if (!window.__echoPromoCodeBooted) {
  window.__echoPromoCodeBooted = true;
  controller = createPromoCodeController({client:supabase});
  const boot = () => controller.start();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else void boot();
}

// Preserve the existing integration export while the UI is now a central gift.
export { loadPromoCodeBanner };
