# LuxeCart Motion & Animation Specification (Hand-off Document for Developers)

> **Project:** LuxeCart Multi-vendor Luxury E-Commerce Platform  
> **Target Platforms:** Web (Desktop) & Responsive Mobile (390px)  
> **Recommended Libraries:** Framer Motion (React/Next.js) / GSAP (Vanilla/Vue) / CSS Keyframes / Lottie  
> **Accessibility Mandate:** Respect `@media (prefers-reduced-motion: reduce)` across all interactions.

---

## 1. Global & Architectural Transitions

### 1.1 Page Change & Route Transitions
- **Effect:** Smooth fade & slight slide transition.
- **Timing / Easing:** 250ms – 300ms, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out quint).
- **Implementation (Framer Motion):**
  ```jsx
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }
  };
  ```
- **Mobile Consideration:** Horizontal slide-in (`x: 100% -> 0%`) for child screens (e.g. PDP from PLP, Checkout from Cart), and instant cross-fade for bottom tab switches (Home, Categories, Wishlist, Cart, Account).

### 1.2 Scroll Reveals (Sections Fade-Up)
- **Effect:** Ambient fade-up as viewport enters screen bounds.
- **Trigger:** `IntersectionObserver` with `threshold: 0.15` and `rootMargin: '0px 0px -40px 0px'`.
- **Properties:**
  - Initial: `opacity: 0`, `transform: translateY(24px)`
  - Active: `opacity: 1`, `transform: translateY(0px)`
  - Duration: `500ms`, Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - Stagger: Child items (e.g., category cards or USP pills) stagger with `delay: index * 60ms`.

---

## 2. Component Micro-Interactions

### 2.1 Product Card Hover & States
- **Card Container:**
  - `transform: translateY(-4px)`
  - `box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)`
  - Transition: `all 240ms cubic-bezier(0.16, 1, 0.3, 1)`
- **Secondary Image Cross-Fade:**
  - Primary image: `opacity: 0` (duration 220ms)
  - Secondary lifestyle/angle image: `opacity: 1`, `scale: 1.04` (duration 350ms ease-out)
- **Quick-Add Action Bar:**
  - Slide up from bottom of thumbnail: `opacity: 1`, `transform: translateY(0)`
  - Resting: `opacity: 0`, `transform: translateY(8px)`

### 2.2 Wishlist Heart Button
- **Effect:** Spring-loaded pop & fill.
- **Keyframes (CSS / Framer Motion):**
  ```css
  @keyframes heartPop {
    0% { transform: scale(1); }
    30% { transform: scale(1.35); }
    60% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
  .heart-active {
    animation: heartPop 360ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    fill: #dc2626;
    color: #dc2626;
  }
  ```

### 2.3 Add to Cart & Cart Badge Reaction
- **Fly-to-Cart Effect:**
  - When "Add to Cart" or quick-add is tapped, clone a 48px product thumbnail proxy.
  - Animate via bezier curve from clicked button coordinates `(x1, y1)` to header cart icon `(x2, y2)`.
  - Duration: `550ms` with accelerating curve. Scale down to `0.2` and fade out at destination.
- **Cart Badge Bounce (Reaction):**
  - Upon arrival of the proxy:
  ```css
  @keyframes cartBounce {
    0% { transform: scale(1); }
    40% { transform: scale(1.45); }
    70% { transform: scale(0.92); }
    100% { transform: scale(1); }
  }
  ```

### 2.4 Cart Slide-Over Drawer
- **Backdrop:** Fade in black overlay (`rgba(15, 23, 42, 0.5)` with `backdrop-filter: blur(4px)`), duration `300ms`.
- **Drawer Panel:**
  - Initial: `transform: translateX(100%)`
  - Active: `transform: translateX(0%)`
  - Transition: `320ms cubic-bezier(0.2, 0.9, 0.2, 1)`
  - Items inside drawer stagger in from right (`x: 12px -> 0px`, stagger `40ms`).

### 2.5 Skeleton Shimmer Loading States
- **Gradient Composition:** `linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)`
- **Animation:** Continuous infinite sweep across background.
  ```css
  @keyframes skeletonShimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-shimmer {
    background-size: 200% 100%;
    animation: skeletonShimmer 1.5s infinite linear;
  }
  ```

### 2.6 Hero Banner Auto-Slide & Parallax
- **Carousel Slide:**
  - Easing: `cubic-bezier(0.25, 1, 0.5, 1)`, duration `600ms`.
  - Parallax depth: Background image moves at `0.6x` speed of foreground text/CTA overlay to create cinematic depth.
- **Progress Bar Indicator:** Linear progress fill from `0%` to `100%` over 5000ms pause interval.

### 2.7 Buttons & Interactive Feedback
- **Hover State:** `transform: translateY(-1px)`, subtle shadow elevation.
- **Active / Press State (Touch & Click):**
  - `transform: scale(0.97)`
  - Transition: `transform 80ms ease-out`
  - Ripple effect on primary Warm Orange CTA (`#F97316`) for mobile touch confirmation.

---

## 3. Motion Timing & Easing Standard Token Matrix

| Token Name | Value | Recommended Usage |
| :--- | :--- | :--- |
| `--ease-out-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Modals, drawers, card hover |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Sliders, tabs, toggles |
| `--ease-spring-pop` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Wishlist heart, badges, icon triggers |
| `--duration-instant` | `80ms – 120ms` | Button active press, checkbox toggle |
| `--duration-quick` | `200ms – 250ms` | Tooltips, dropdowns, icon flips |
| `--duration-moderate`| `300ms – 350ms` | Drawers, dialogs, accordions |
| `--duration-deliberate`| `500ms – 650ms` | Hero sliders, fly-to-cart, route transitions |

---

## 4. Accessibility Compliance (`prefers-reduced-motion`)

For users with vestibular disorders or motion sensitivity, all translate, fly-to-cart, scale, and parallax animations **MUST be downgraded to simple instant opacity fades or disabled entirely**:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Retain accessible subtle fade without disorienting movement */
  .fade-accessible {
    transition: opacity 150ms ease !important;
    transform: none !important;
  }
}
```
