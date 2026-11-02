# PRD – Customisable Multi-Seller Shopping Cart Platform

**Version:** 1.0 (Draft)\
**Date:** 24 October 2026\
**Prepared for:** Rakesh\
**Product type:** Website + Web Application (E-commerce SaaS / Store Builder)

## 1. Product Overview

Yeh ek modern, fully customisable e-commerce platform hoga jahan koi bhi seller/user apna online store khud bana sake, apne products add kar sake, store ka theme, logo, naam aur look apne hisab se badal sake, aur Razorpay ke through payment le sake. Platform ka design Amazon, Flipkart aur Meesho se inspired hoga, lekin premium look, smooth motion graphics aur easy admin panel ke saath.

**One-line vision:** "Ek aisa store builder jahan seller bina coding ke apna premium online store 15 minute mein live kar sake."

## 2. Goals & Objectives

- Seller bina technical knowledge ke apna store setup, customise aur manage kar sake.
- Customers ko Amazon/Flipkart jaisa fast, familiar aur smooth shopping experience mile.
- Razorpay se secure online payment aur COD support.
- Admin panel se sab kuch (products, orders, theme, settings) easily control ho.
- Premium UI: modern cards, micro-interactions, animations, dark/light mode.
- Mobile-first, fast loading, SEO-friendly.

### Success Metrics

| Metric | Target |
| --- | --- |
| Naya seller store setup time | 15 minute se kam |
| Page load (LCP) | 2.5 sec se kam |
| Checkout completion rate | 60%+ cart-to-order |
| Payment success rate | 95%+ |
| Mobile Lighthouse score | 85+ |
| Admin task (product add) | 1 minute se kam |

## 3. Target Users (Personas)

1. **Super Admin (Platform Owner):** Poore platform ko manage karta hai – sellers, plans, commission, global settings.
2. **Seller / Store Owner:** Apna store banata hai, products add karta hai, orders handle karta hai, theme customise karta hai.
3. **Customer / Buyer:** Products browse karta hai, cart mein add karta hai, payment karke order karta hai.
4. **Staff / Manager (optional):** Seller ke under limited access (orders, inventory).

## 4. Scope

### In Scope (Version 1)

- Multi-seller store creation (har seller ka apna store, apna URL/subdomain)
- Storefront (website) with product listing, product cards, product detail pages
- Cart, Wishlist, Checkout, Order tracking
- Razorpay payment gateway + COD, Shiprocket aur Delhivery shipping integration
- Seller Admin Panel (product, order, customer, theme, settings management)
- Super Admin Panel (platform control)
- Theme customiser (logo, site name, colours, fonts, layout, banners)
- Motion graphics & premium UI

### Out of Scope (Later Versions)

- Native mobile apps (Android/iOS)
- Multi-currency / international shipping
- Advanced commission analytics aur tiered commission plans
- Advanced AI recommendations
- Third-party marketplace sync (Amazon/Flipkart listing sync)

## 5. User Roles & Permissions

| Feature | Super Admin | Seller | Staff | Customer |
| --- | --- | --- | --- | --- |
| Platform settings | Yes | No | No | No |
| Seller approve/suspend | Yes | No | No | No |
| Store theme/branding | Yes | Yes | No | No |
| Product add/edit/delete | Yes | Yes | Yes (limited) | No |
| Order management | Yes | Yes | Yes | Own orders |
| Place order | – | – | – | Yes |
| View reports | Yes | Own store | Limited | No |

## 6. Functional Requirements

### 6.1 Storefront (Customer Website)

**A. Homepage**

- Hero banner / slider (admin se editable) with auto-play aur swipe
- Category icons strip (Meesho/Flipkart style)
- Sections: Featured Products, New Arrivals, Best Sellers, Deals of the Day (countdown timer)
- Promotional banners, brand logos, testimonials, newsletter signup
- Sticky header with search bar, cart icon (live count), account menu

**B. Product Listing Page**

- Grid / List view toggle
- Filters: Category, Price range, Brand, Rating, Discount, Availability
- Sorting: Popularity, Price low-high / high-low, Newest, Rating
- Pagination ya infinite scroll
- Quick view (modal) aur quick add-to-cart

**C. Product Card (Reusable Component)**

- Product image (hover par second image / zoom effect)
- Product name, price, MRP (strikethrough), discount % badge
- Rating stars + review count
- Badges: New, Sale, Bestseller, **Sold Out**, Low Stock
- Wishlist heart icon (animated)
- Add to Cart button (hover par smooth reveal)
- **Sold Out state:** image grayscale + "Sold Out" badge + Add to Cart disabled + "Notify Me" option

**D. Product Detail Page**

- Image gallery (multiple images, zoom on hover, video support)
- Title, price, discount, stock status, SKU
- Variants (size, colour, etc.) with variant-wise price/stock/image
- Quantity selector, Add to Cart, Buy Now
- Delivery pincode check (estimated delivery)
- Description, specifications table, highlights, FAQs
- Customer reviews & ratings (with photo reviews)
- Related products / "Customers also bought"
- Share buttons, wishlist, breadcrumb navigation
- Sticky "Add to Cart" bar on mobile

**E. Cart**

- Mini-cart drawer (slide-in) + full cart page
- Quantity update, remove, save for later
- Coupon code apply, price breakdown (subtotal, discount, shipping, tax, total)
- Cart persist ho (login ke baad bhi, guest cart bhi)

**F. Checkout**

- Guest checkout ya login/signup (Email/Mobile + OTP)
- Address management (multiple addresses)
- Shipping method selection
- Payment options: Razorpay (UPI, Cards, NetBanking, Wallets, EMI) + Cash on Delivery
- Order summary, order confirmation page, email/SMS/WhatsApp confirmation

**G. Customer Account**

- Profile, addresses, order history, order tracking, invoice download
- Return/refund/cancel request
- Wishlist, saved cards (Razorpay tokenisation)

**H. Search**

- Instant search with suggestions, typo tolerance, recent searches
- Category-wise search

### 6.2 Seller Admin Panel (Store Management)

**A. Dashboard**

- Today's sales, orders, revenue, visitors, conversion
- Sales graph (daily/weekly/monthly), top products, low stock alerts
- Recent orders, pending actions

**B. Product Management (Core Requirement)**

- **Add Product:** name, description (rich text editor), images/videos (drag & drop, multiple), category, brand, tags, price, MRP, SKU, stock quantity, weight/dimensions, GST/tax %, SEO fields
- **Variants:** size/colour/custom attributes with separate price, stock, SKU, image
- **Custom Fields:** seller apne hisab se extra fields bana sake (e.g. Material, Warranty)
- **Edit / Update:** kisi bhi product ko inline ya form se edit karna
- **Delete:** single aur bulk delete (soft delete with restore option)
- **Pause / Unpause:** product ko temporarily hide karna bina delete kiye
- **Mark as Sold Out:** ek click toggle; ya stock 0 hone par auto Sold Out
- **Status:** Draft, Active, Paused, Sold Out, Archived
- **Bulk actions:** Bulk upload via CSV/Excel, bulk edit price/stock, bulk pause/delete, export
- **Duplicate product** option
- **Category Management:** category/sub-category tree, icon/image, reorder drag & drop
- **Inventory Management:** stock tracking, low stock alert threshold, stock history

**C. Order Management**

- Order list with filters (status, date, payment type)
- Statuses: Pending, Paid, Processing, Shipped, Delivered, Cancelled, Returned, Refunded
- Order detail, status update, invoice/packing slip print
- Refund initiate (Razorpay refund API)
- Shipping details & tracking ID add karna

**D. Customer Management**

- Customer list, order history, block/unblock, export

**E. Marketing Tools**

- Coupons/Discounts (percentage, flat, free shipping, min order, expiry, usage limit)
- Banner/Slider manager, Flash sale scheduler
- Abandoned cart reminders (email/WhatsApp)
- SEO settings (meta title, description, sitemap)

**F. Reports & Analytics**

- Sales report, product performance, tax report, customer report
- Export CSV/PDF

**G. Settings**

- Store details (name, contact, address, GST number)
- Payment settings (Razorpay Key ID / Secret, COD on/off)
- Shipping settings (zones, flat rate, free shipping above X)
- Tax settings, email/SMS templates, domain connect
- Staff accounts & roles

### 6.3 Theme & Store Customisation (Core Requirement)

Seller admin panel se bina code ke yeh sab modify ho sake, with **live preview**:

- **Branding:** Site name, logo (light/dark), favicon, tagline
- **Colours:** Primary, secondary, accent, background, text colours (colour picker + ready presets)
- **Typography:** Font family (Google Fonts), font sizes
- **Layout:** Header style (3-4 options), footer style, homepage section order (drag & drop), grid columns, card style (rounded/sharp/shadow/minimal)
- **Theme Presets:** 5-8 premium ready-made themes (Fashion, Electronics, Grocery, Beauty, Minimal, Dark Luxe etc.) – ek click mein apply
- **Homepage Builder:** sections add/remove/reorder – Banner, Categories, Product Slider, Deals, Testimonials, Brands, Custom HTML, Video
- **Animations Control:** on/off aur intensity (page transitions, hover effects, scroll animations)
- **Dark / Light mode** toggle
- **Custom CSS** (advanced sellers ke liye)
- **Pages Manager:** About, Contact, Privacy Policy, Terms, FAQ, Shipping & Returns – editable
- **Menu Manager:** header/footer menus drag & drop
- **Save Draft / Publish / Revert to previous version**

### 6.4 Multi-Seller Store Creation

- Seller registration (email/mobile + OTP) → store setup wizard (Store name → Category → Logo → Theme choose → First product → Payment setup → Go live)
- Har store ka unique URL: `storename.yourplatform.com` ya custom domain
- Har store ka data isolated (products, orders, customers, theme)
- Commission model, koi subscription fee nahi (rate Super Admin se set hota hai) – seller-wise commission override aur product limits
- Super Admin seller approval/suspension

### 6.5 Super Admin Panel

- Sellers list, approve/reject/suspend, impersonate (support ke liye)
- Commission rates, seller billing aur payout management
- Global theme templates manage karna
- Platform-wide analytics
- Commission settings, payouts (Razorpay Route – Phase 2)
- System settings, email/SMS gateway, audit logs

### 6.6 Payment Integration – Razorpay

- Razorpay Standard Checkout integration (UPI, Cards, NetBanking, Wallet, EMI, Pay Later)
- Server-side order creation (Razorpay Orders API) → payment → **signature verification** → order confirm
- **Webhooks** handle karna: payment.captured, payment.failed, refund.processed
- Refund & partial refund support
- Failed payment retry, payment status tracking
- Seller apni Razorpay keys panel se daal sake (har store ke liye alag)
- COD with optional COD charge
- Test mode / Live mode toggle
- Secrets encrypted store honge, kabhi frontend mein expose nahi

### 6.7 Notifications

- Email: order confirmation, shipping update, invoice, password reset
- SMS / WhatsApp (Phase 2): order updates, OTP
- Seller alerts: new order, low stock

## 7. UI / UX Requirements (Premium Look & Motion)

**Design Inspiration:** Amazon (functionality & search), Flipkart (clean product grid & filters), Meesho (mobile-first, simple, value-focused).

**Visual Style**

- Modern, clean, premium – generous white space, soft shadows, rounded corners, glassmorphism accents
- High-quality typography aur consistent design system (tokens, components)
- Light & Dark mode

**Motion & Animations**

- Smooth page transitions aur scroll-reveal animations
- Product card hover: lift, image zoom/swap, quick-add reveal
- Animated wishlist heart, add-to-cart fly-to-cart animation
- Skeleton loaders (shimmer) instead of spinners
- Hero banner parallax/auto-slider, animated counters, marquee for brands/offers
- Slide-in cart drawer, animated toast notifications
- Micro-interactions on buttons, inputs, toggles
- Recommended libraries: Framer Motion / GSAP / Lottie
- `prefers-reduced-motion` respect karna (accessibility)

**UX Principles**

- Mobile-first responsive (360px se 1920px)
- Max 3 clicks mein product se checkout
- Clear sold-out/low-stock indicators
- Fast, accessible (WCAG 2.1 AA), English default with switchable multi-language support (Hindi se shuru, i18n ready)

## 8. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Performance | LCP < 2.5s, API response < 500ms, image lazy-load + WebP/AVIF, CDN |
| Scalability | 1,000+ stores, 100k+ products, horizontal scaling |
| Security | HTTPS, JWT/session auth, password hashing (bcrypt/argon2), RBAC, CSRF/XSS/SQL-injection protection, rate limiting, input validation, PCI-DSS compliance via Razorpay (card data kabhi store nahi) |
| Data Isolation | Multi-tenant – ek seller dusre ka data access na kar sake |
| SEO | SSR/SSG, meta tags, schema.org Product markup, sitemap.xml, clean URLs |
| Availability | 99.5%+ uptime, daily backups |
| Compatibility | Latest Chrome, Safari, Firefox, Edge; Android & iOS browsers |
| Compliance | GST invoice, Privacy Policy, Terms, Refund Policy, IT Act / DPDP Act India |
| Accessibility | Keyboard navigation, alt text, contrast ratios |

## 9. Suggested Tech Stack

| Layer | Recommended Option |
| --- | --- |
| Frontend | Next.js (React) + Tailwind CSS + Framer Motion |
| Admin Panel | Next.js / React with shadcn/ui or Ant Design |
| Backend | Node.js (NestJS / Express) **ya** Laravel (PHP) – jo team ko comfortable ho |
| Database | PostgreSQL ya MySQL (multi-tenant schema), Redis for cache/session |
| Search | Meilisearch / Elasticsearch / Algolia |
| File Storage | AWS S3 / Cloudinary / Cloudflare R2 + CDN |
| Payments | Razorpay (Orders API, Webhooks, Refunds) |
| Auth | JWT + OTP login (MSG91 / Twilio) |
| Email | AWS SES / SendGrid / Brevo |
| Hosting | Vercel + VPS/AWS/DigitalOcean; Docker |
| Analytics | Google Analytics 4, Meta Pixel (seller panel se ID add) |

*Note: Agar budget kam ho ya jaldi launch karna ho, to ek simple single-codebase approach (Next.js + Supabase/Firebase) bhi use ki ja sakti hai.*

## 10. Data Model (High Level)

- **Store** (id, owner\_id, name, slug, domain, logo, theme\_config JSON, status, plan\_id)
- **User** (id, role, name, email, mobile, password\_hash, store\_id)
- **Category** (id, store\_id, parent\_id, name, image, sort\_order)
- **Product** (id, store\_id, category\_id, title, slug, description, price, mrp, sku, stock, status \[draft/active/paused/sold\_out/archived\], images, seo, custom\_fields JSON)
- **ProductVariant** (id, product\_id, attributes JSON, price, stock, sku, image)
- **Cart / CartItem**
- **Order** (id, store\_id, customer\_id, status, payment\_status, totals, address, shipping)
- **OrderItem** (id, order\_id, product\_id, variant\_id, qty, price)
- **Payment** (id, order\_id, razorpay\_order\_id, razorpay\_payment\_id, signature, status, amount)
- **Coupon**, **Review**, **Wishlist**, **Address**, **Banner**, **Page**, **Menu**
- **Plan / Subscription**, **AuditLog**, **Notification**

## 11. Key User Flows

**Seller Flow:** Register → Verify OTP → Store Setup Wizard → Choose Theme → Add Products → Connect Razorpay → Publish Store → Share Link → Manage Orders

**Customer Flow:** Visit Store → Browse/Search → Product Page → Add to Cart → Checkout → Razorpay Payment → Order Confirmation → Track Order

**Product Lifecycle:** Draft → Active → (Paused ⇄ Active) → Sold Out (manual/auto) → Restock → Active → Archived/Deleted

## 12. Development Phases & Timeline (Estimate)

| Phase | Deliverables | Duration |
| --- | --- | --- |
| Phase 0 – Planning | PRD finalise, wireframes, UI design system | 2–3 weeks |
| Phase 1 – MVP Core | Auth, single store, product CRUD (add/update/delete/pause/sold out), storefront, cart, checkout, Razorpay, basic admin | 8–10 weeks |
| Phase 2 – Customisation | Theme customiser, homepage builder, presets, branding settings, pages/menu manager | 4–5 weeks |
| Phase 3 – Multi-Seller | Store creation wizard, subdomains, commission engine, Super Admin panel | 4–5 weeks |
| Phase 4 – Polish | Motion graphics, performance, SEO, notifications, reports | 3–4 weeks |
| Phase 5 – Testing & Launch | QA, security audit, UAT, deployment | 2–3 weeks |

**Total estimate:** approx. 5–6 mahine (team size aur scope par depend karta hai).

## 13. Acceptance Criteria (Key Items)

1. Seller panel se product add, edit, delete, pause aur sold-out 1–2 clicks mein ho aur storefront par turant reflect ho.
2. Sold-out product par "Add to Cart" disabled ho aur badge dikhe.
3. Razorpay payment successful hone par hi order "Paid" ho (signature + webhook verified).
4. Seller logo, site name, colours aur theme badle to live preview aur publish ke baad storefront par apply ho.
5. Ek seller ko dusre seller ka data kabhi na dikhe.
6. Site mobile par smooth chale aur animations 60fps ke aas-paas rahein.
7. Order confirmation email customer aur seller dono ko jaye.

## 14. Risks & Mitigation

| Risk | Mitigation |
| --- | --- |
| Scope bahut bada (builder + marketplace) | MVP pehle, phased release |
| Heavy animations se slow performance | Lazy-load, GPU-friendly animations, reduced-motion option |
| Multi-tenant data leak | Tenant-scoped queries, automated tests, security audit |
| Payment failures / mismatches | Webhook reconciliation, retry, logs |
| Seller Razorpay KYC delay | Test mode + COD se start, onboarding guide |

## 15. Decisions & Open Questions

**Confirmed decisions** (aapke jawab ke hisab se):

| # | Sawal | Decision | PRD par asar |
| --- | --- | --- | --- |
| 1 | Store type | Multi-seller platform | Har seller ka alag store, alag URL, isolated data (sections 6.4, 6.5) |
| 2 | Tech stack | Best aur secure stack | Recommended: Next.js (TypeScript) frontend, NestJS (TypeScript) backend, PostgreSQL with row-level security for tenant isolation, Redis, S3/Cloudflare R2 + CDN, Meilisearch. Security: argon2 password hashing, 2FA for admin/seller, encrypted secrets, WAF, rate limiting, audit logs |
| 3 | Revenue model | Commission based; charge other platforms ka lagbhag 1/4th | Subscription plans nahi; Super Admin se commission rate set hoga (seller-wise override ke saath). Razorpay ka apna gateway charge alag lagega, ise commission rate tay karte waqt dhyan mein rakhna hoga |
| 4 | Shipping partners | Shiprocket aur Delhivery add karne hain | In scope; order se shipment create, tracking aur rate calculation |
| 5 | Bhasha | English first, multi-language switchable | Default English; language switcher (Hindi se shuru) aur i18n architecture |

**Abhi open (baad mein decide hoga):**

- [ ] Estimated budget aur launch deadline
- [ ] Custom domain connect karne ki facility pehle version mein ya baad mein

## 16. Future Enhancements (Roadmap)

- AI product description generator & AI-based recommendations
- Shiprocket/Delhivery integration, WhatsApp commerce
- Marketplace mode (sabhi sellers ke products ek jagah) with commission/payouts
- Reels/video shopping, live commerce
- Loyalty points, referral system, subscriptions
- App-store jaisa theme & plugin marketplace
