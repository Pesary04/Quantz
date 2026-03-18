# Quantz Financial Services CC - Website

## Overview
A beautiful, professional landing page website for Quantz Financial Services CC — an insurance brokerage firm in Namibia. Built with React, TypeScript, Tailwind CSS.

## Architecture
- **Frontend**: React + TypeScript, Tailwind CSS, shadcn/ui, lucide-react icons, react-icons
- **Backend**: Express.js (serves static frontend, no DB needed)
- **Routing**: wouter (single page)

## Brand
- **Colors**: Deep blue (#0a2540), Brand blue (#1e7bc4), Navy (#1e3d5c)
- **Font**: Poppins
- **Logo**: /public/quantz-logo.png (blue/silver pyramid mark)
- **Contact**: +264 81 820 1522 | info@quantz.com.na | Windhoek, Namibia

## Pages
- `/` → Home page (`client/src/pages/home.tsx`)

## Sections (in order)
1. **Navbar** — Sticky, logo + nav links + phone + Get a Quote CTA, mobile hamburger
2. **Hero** — Deep blue gradient, headline, badge with Namibian flag, hero card with logo
3. **Services** — 6 cards with detailed bullet points: Life Insurance, Pension Fund, Medical Aid, Short-term Insurance, Retirement Annuity, Savings & Investment
4. **Why Choose Quantz** — Blue gradient, 3 key points, contact card with logo
5. **Partners** — 7 insurer partners: Sanlam|Allianz, Santam, Old Mutual, Hollard, PPS, NISEDI, Capricorn Asset Management
6. **How It Works** — 3 numbered steps (01, 02, 03)
7. **Testimonials** — 3 client testimonials with star ratings
8. **Contact** — Blue gradient, contact info + full quote request form
9. **Footer** — Logo, service links, contact info, social media, copyright

## Public Assets
- `client/public/quantz-logo.png` — Brand logo
- `client/public/services-brochure.jpg` — Reference brochure
- `client/public/why-choose-brochure.jpg` — Reference brochure
