# ReCircle Foundation Website - Product Requirements Document

## Original Problem Statement
Create a professional, modern, impact-driven website for ReCircle Foundation - a non-profit organization focused on building India's circular economy through social inclusion, innovation, and measurable impact.

## Project Overview
**Organization:** ReCircle Foundation  
**Type:** Non-profit Circular Economy Foundation  
**Vision:** A world where circularity transcends business and becomes an inclusive, equitable, and regenerative social movement  
**Date Started:** February 28, 2026  
**Current Status:** Frontend MVP Complete (Mock Data)

## Brand Guidelines (Strictly Enforced)
### Typography
- **Primary Font:** Plus Jakarta Sans (Alternative to Nohemi - Google Fonts)
- Applied across all headings, body text, navigation, and buttons

### Color Palette
- **Primary Blue:** #1298a0 (Dominant brand color - navigation, buttons, headings, links)
- **Off-white:** #F7F1ee (Main background)
- **Secondary Green:** #00c499 (Impact statistics, sustainability highlights)
- **Secondary Yellow:** #deed4b (Subtle accents and highlights)
- **Secondary Red:** #e71821 (Urgency/important emphasis only)

### Design Principles
- Minimal and institutional aesthetic
- Generous section spacing
- Subtle animations (fade-in, scroll reveal, hover interactions)
- Soft shadows
- Rounded corners (8-12px)
- No clutter, no cartoon visuals, no heavy gradients
- Professional credibility targeting CSR/ESG partners

## User Personas
1. **Corporate CSR/ESG Decision Makers:** Looking for credible impact partners
2. **Foundation Donors:** Seeking transparent, measurable impact organizations
3. **Government Bodies:** Potential collaboration partners for circular economy initiatives
4. **Waste Workers (Safai Saathis):** Understanding benefits and support programs
5. **General Public:** Learning about circular economy and behavioral change

## Architecture & Tech Stack
### Frontend
- **Framework:** React 19.0.0
- **Routing:** React Router DOM 7.5.1
- **Styling:** TailwindCSS 3.4.17
- **UI Components:** Shadcn/UI (Radix UI primitives)
- **Icons:** Lucide React (NO emoji characters)
- **Toasts:** Sonner
- **Font:** Plus Jakarta Sans (Google Fonts)

### Backend (Future Phase)
- **Framework:** FastAPI
- **Database:** MongoDB (Motor async driver)
- **Hosting:** Emergent Platform

## Website Structure

### Navigation Menu (Sticky Header)
1. Home
2. About
3. Focus Areas
4. Impact (External link to www.recircle.in/impact)
5. Get Involved

### Page 1: HOME
**Sections:**
1. **Hero Section**
   - Full-screen immersive banner with overlay
   - Main headline: "Building the Social Infrastructure Behind India's Circular Future"
   - CTA: "Partner With Us"
   - Background: Waste workers image with teal gradient overlay

2. **About the Foundation**
   - 4-paragraph content about mission and approach
   - Off-white background
   - Clean typography with proper spacing

3. **Our Commitment to Global SDGs**
   - 7 SDG cards (8, 9, 11, 12, 13, 14, 17)
   - Each with icon, title, and description
   - Grid layout (3 columns on desktop)

4. **Our Areas of Action (Focus Areas Preview)**
   - 6 interactive flip cards
   - Front: Icon + Title
   - Back: Description
   - Hover to flip (desktop) / Click to flip (mobile)
   - Focus areas: Waste Diversion, Formalisation, Waste to Resources, Behavioral Change, Livelihood, Health & Safety

5. **Impact Statistics**
   - Teal background section
   - 5 key metrics with large numbers in yellow
   - Headline: "The real impact happens after the bin."

6. **Contact Form**
   - Fields: Name, Email, Organization, Message
   - Mock submission with toast notification
   - CTA: "Be the reason the system changes for good"

7. **Footer**
   - Logo, quick links, contact info, social media
   - Dark background

### Page 2: ABOUT
**Sections:**
1. **Hero Banner**
   - "RECIRCLE FOUNDATION WAS BUILT FOR THE PEOPLE BEHIND THE SYSTEM."
   - Background: About mission image with overlay

2. **About the Foundation**
   - Founding story (2023)
   - Infrastructure vs. human side narrative
   - CSR/ESG partner positioning

3. **Our Vision**
   - 3 vision pillars in card layout with icons
   - Formalise & protect safai saathis
   - Drive behavioural change
   - Direct capital

4. **Core Pillars (Guiding Principles)**
   - 6 interactive flip cards
   - Principles: Inclusivity, Collaboration, Transparency, Innovation, Local-First, Insight-Driven
   - Same flip interaction as home page

5. **Team Cards**
   - 4 team members with placeholder images
   - Name and designation
   - Grid layout with hover effects

6. **Contact Form** (Same as Home)

7. **Footer**

### Page 3: FOCUS AREAS
**Sections:**
1. **Hero/Intro**
   - Gradient background (teal to green)
   - Powerful question: "If circularity can give materials a second life / Why should people be left behind?"
   - Context about CSR partnerships

2. **6 Detailed Focus Area Sections**
   Each alternating layout (image left/right):
   - **Waste Diversion:** Organized collection networks
   - **Formalisation of Safai Saathis:** Securing wages, safety, dignity
   - **Turning Waste Into Resources:** Recycled products
   - **Driving Behavioral Change:** Community education programs
   - **Securing Livelihood Opportunities:** Training and skill-building
   - **Health & Safety Access:** Check-ups, protective equipment

3. **Contact Form** (Same as Home)

4. **Footer**

### Page 4: IMPACT
- **External Link:** Redirects to www.recircle.in/impact
- Opens in new tab

### Page 5: GET INVOLVED
**Sections:**
1. **Hero CTA**
   - Gradient background (teal-green-teal)
   - "Partner for Impact!"
   - Strong call to action messaging

2. **Contact Cards**
   - 3 cards: Email Us, Call Us, Visit Us
   - Icons with contact information
   - Hover effects

3. **Contact Form**
   - Enhanced with context: "Let's Create Impact Together"
   - Same form fields as other pages

4. **Footer**

## What's Been Implemented (Phase 1 - Frontend MVP)
**Date Completed:** February 28, 2026

### ✅ Completed Features
1. **Complete Frontend Structure**
   - All 5 pages built with React Router
   - Sticky navigation with active state indicators
   - Smooth scrolling and page transitions
   - Fully responsive design (mobile, tablet, desktop)

2. **Brand Implementation**
   - Plus Jakarta Sans font integrated via Google Fonts
   - Exact color palette applied (#1298a0, #F7F1ee, #00c499, #deed4b, #e71821)
   - Institutional design aesthetic maintained
   - Professional imagery from Unsplash

3. **Interactive Components**
   - Flip cards (hover on desktop, click on mobile)
   - Contact form with mock submission
   - Toast notifications (Sonner)
   - Hover animations on buttons and cards
   - Team card hover effects

4. **Content Integration**
   - ALL content from PDF used EXACTLY as written
   - No paraphrasing or modifications
   - Proper heading hierarchy (H1, H2, H3)
   - SEO-ready structure

5. **Mock Data System**
   - Centralized mock.js file with all content
   - Easy transition path for backend integration
   - Contact form mock submission
   - Toast feedback for user actions

### 📦 Components Created
- `Header.jsx` - Sticky navigation with mobile menu
- `Footer.jsx` - Multi-column footer with links and social
- `ContactForm.jsx` - Reusable form component
- `FlipCard.jsx` - Interactive card with 3D flip animation
- `TeamCard.jsx` - Team member display with hover effects
- `Home.jsx`, `About.jsx`, `FocusAreas.jsx`, `GetInvolved.jsx` - Page components
- `mock.js` - Centralized content data

### 🎨 Design Features
- Fade-in animations on hero sections
- Smooth scroll behavior
- 3D flip card transforms with backface-hidden
- Gradient overlays on hero images
- Proper color contrast for accessibility
- Generous whitespace and section spacing
- Shadow and hover effects for depth

## Next Action Items

### Phase 2: Backend Development (P0)
1. **Database Models**
   - Contact form submissions schema
   - Team members management
   - Impact statistics (if dynamic)

2. **API Endpoints**
   - POST /api/contact - Submit contact form
   - GET /api/team - Fetch team members (if dynamic)
   - POST /api/newsletter - Newsletter subscription (if added)

3. **Email Integration**
   - Contact form email notifications
   - Auto-responder for form submissions
   - Integration options: SendGrid, Nodemailer, AWS SES

4. **Admin Panel** (Optional P1)
   - Manage contact form submissions
   - Update team members
   - Update impact statistics

### Phase 3: Enhancements (P1)
1. **Team Photos** - Replace placeholder images with actual photos
2. **Impact Dashboard** - If not using external link, build internal dashboard
3. **Blog/News Section** - Share updates and stories
4. **Case Studies** - Detailed success stories
5. **Downloadable Resources** - Annual reports, brochures
6. **Multi-language Support** - Hindi/regional languages

### Phase 4: Advanced Features (P2)
1. **Donation Integration** - Stripe/Razorpay for donations
2. **Newsletter System** - Email capture and campaigns
3. **Impact Calculator** - Interactive tool for partners
4. **Virtual Tours** - Waste recovery site tours
5. **Volunteer Portal** - Sign-up and management system
6. **Analytics Dashboard** - Google Analytics 4, heatmaps
7. **Accessibility Audit** - WCAG 2.1 AA compliance
8. **Performance Optimization** - Image optimization, lazy loading, CDN

## Technical Notes

### Environment Setup
- Frontend runs on port 3000 (supervisor managed)
- Backend will run on port 8001 with /api prefix
- MongoDB connection via MONGO_URL env variable
- Hot reload enabled for development

### Content Management
- All content currently in `/app/frontend/src/data/mock.js`
- Backend integration will require removing mock data
- Maintain exact content from PDF during migration

### Design Constraints
- NO emoji icons - use Lucide React only
- NO dark purple/blue or purple/pink gradients
- NO cartoon-style visuals
- Gradients limited to hero sections only
- Maintain generous whitespace
- Professional, institutional tone throughout

## Success Metrics (Future)
1. **Engagement:** Time on site, page views, bounce rate
2. **Conversions:** Contact form submissions, partnership inquiries
3. **Reach:** Unique visitors, returning visitors
4. **Impact:** Actual partnerships formed, donations received
5. **SEO:** Organic search rankings, backlinks

## Competitive Positioning
ReCircle Foundation website should feel like:
- A national foundation (credible, established)
- A sustainability think tank (data-driven, expert)
- A credible impact institution (measurable, transparent)

NOT like:
- Startup-style flashy layouts
- Overly playful design
- Generic NGO template sites
- Stock imagery heavy sites

## Risks & Mitigation
1. **Content Updates:** Need CMS or easy update mechanism → Backend admin panel
2. **Team Photos:** Currently placeholders → Collect actual photos in Phase 2
3. **Impact Data:** External link dependency → Consider internal dashboard
4. **Email Deliverability:** Contact form needs reliable service → Use SendGrid/AWS SES
5. **Mobile Performance:** Image-heavy sections → Optimize images, lazy loading

## Stakeholder Sign-off
- ✅ Brand colors and typography approved
- ✅ Content from PDF used exactly as provided
- ✅ Design aesthetic: institutional and professional
- ✅ Interactive elements: flip cards approved
- ✅ External Impact link confirmed
- ✅ Contact form mock functionality accepted for Phase 1

---

**Last Updated:** February 28, 2026  
**Version:** 1.0 (Frontend MVP Complete)  
**Next Review:** Upon backend development start
