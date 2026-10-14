# YOUR CAFÉ — Final browser QA checklist

Use synthetic/demo nicknames only. Open Developer Tools (F12); watch Console + Network.

## Navigation / responsive widths
- [ ] Test 320, 360, 375, 390, 768, 1024 and 1440px viewport widths.
- [ ] Run `document.documentElement.scrollWidth > window.innerWidth` in Console on EVERY major page.
- [ ] Test menu drawer opening/closing via pointer, Escape and keyboard Tab.
- [ ] Test PublicLayout links and StaffLayout links, especially /staff/settings and /staff/menu-management.
- [ ] Reload deep URL: /staff/pos, /staff/reports, /reserve, /gallery on deployed Netlify.
- [ ] With keyboard only, move through menu, cart, reservation and staff controls; focus must be visible.
- [ ] Turn on OS “Reduce Motion” and verify intro is short and animations are reduced.

## Customer workflows
- [ ] /menu → choose latte/customization → /cart → quantity adjust → promo BREW5 → demo checkout.
- [ ] /orders → correct reference/status and no false payment claims.
- [ ] /reserve → future date; select table; reserve; overlapping identical slot must be blocked.
- [ ] /availability → current occupancy displays without guest identities; future slot reflects reservations.
- [ ] /coffee-beans → add house blend to the same cart → checkout.
- [ ] /gift-cards → draft remains demo-only; no redemption claim.
- [ ] /events → duplicate signup blocked (browser-only).
- [ ] /contact → copy inquiry and verify NOT automatically transmitted to a server.

## Staff workflows
- [ ] /staff/tables → seat guests → move guest to another eligible table.
- [ ] /staff/pos → create dine-in ticket on occupied table. Attempt to attach to unoccupied table should fail.
- [ ] /staff/orders → received → accepted → preparing → ready → completed.
- [ ] /staff/inventory → inventory reduces ONCE after completed; restock works.
- [ ] /staff/transactions → record manual demo payment; ensure second payment rejected; print demo receipt.
- [ ] /staff/tables → checkout paid table; cleaning flag set; clear cleaning.
- [ ] /staff/reports → figures based on demo transactions, not invented real sales; CSV export.
- [ ] /staff/customers → nickname records reflect demo orders; no real PII.
- [ ] /staff/activity → actions appear in timeline.
- [ ] /staff/menu-management → draft saves, but original live menu must NOT silently change.
- [ ] /staff/settings → export backup; reset DEMO data only after confirmation.

## Deployment / smoke
- [ ] `node scripts/audit-project.mjs` completes with 0 errors.
- [ ] `node scripts/smoke-cafe-engine.mjs` passes with your ORIGINAL config.js.
- [ ] `npm run build` succeeds (no missing icon, missing file, or duplicate React Route error).
- [ ] Netlify build result published as dist with SPA route fallback.
- [ ] Mobile touch targets easy to tap, no clipping / inaccessible sticky dialogs.

**Not production-ready:** no backend sync, account auth, real payment gateway, or secure inventory booking.
