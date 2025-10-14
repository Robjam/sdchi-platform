# Marketing Components for SDCHI Platform

## Current State

### Existing Components
- `::cta-private-beta` - Call to action for private beta signup (currently implemented as TODO)

### Project Structure
- Using Nuxt.js with Nuxt Content module
- Components located in `app/components/content/`
- Markdown files processed with `::component-name` syntax

## Proposed Marketing Components

### 1. Layout & Structure Components

#### `::hero`
```markdown
::hero{title="Main Headline" subtitle="Supporting text" image="/hero-image.jpg"}
Hero content with optional background image and CTA buttons
::
```
- **Use case**: Landing page headers, feature introductions
- **Props**: title, subtitle, image, alignment, background-color

#### `::split-card`
```markdown
::split-card{image="/feature-image.jpg" image-position="left"}
## Feature Title
Feature description with image on left or right side
::
```
- **Use case**: Feature explanations, product showcases
- **Props**: image, image-position (left/right), reverse-mobile

#### `::container`
```markdown
::container{size="large" padding="xl"}
Wrapped content with consistent spacing and max-width
::
```
- **Use case**: Section containers with consistent spacing
- **Props**: size (small/medium/large/full), padding, background

### 2. Feature & Benefit Components

#### `::feature-grid`
```markdown
::feature-grid
---
features:
  - title: "Feature 1"
    description: "Description"
    icon: "⚡"
  - title: "Feature 2" 
    description: "Description"
    icon: "☕"
---
::
```
- **Use case**: Benefits sections, feature overviews
- **Props**: columns (2/3/4), features array, center-align

#### `::benefit-card`
```markdown
::benefit-card{icon="💰" title="Save Money"}
Detailed explanation of this specific benefit
::
```
- **Use case**: Individual benefit callouts
- **Props**: icon, title, color, size

#### `::stats`
```markdown
::stats
---
stats:
  - number: "10,000+"
    label: "Happy Customers"
  - number: "50hrs"
    label: "Time Saved Monthly"
---
::
```
- **Use case**: Social proof, metrics display
- **Props**: stats array, layout (horizontal/grid)

### 3. Social Proof Components

#### `::testimonial`
```markdown
::testimonial{author="John Doe" role="Cafe Owner" avatar="/john.jpg"}
"This product changed how we manage our business hours completely!"
::
```
- **Use case**: Customer testimonials, reviews
- **Props**: author, role, company, avatar, rating

#### `::testimonial-grid`
```markdown
::testimonial-grid
---
testimonials:
  - quote: "Amazing product!"
    author: "Jane Smith"
    role: "Restaurant Owner"
---
::
```
- **Use case**: Multiple testimonials display
- **Props**: testimonials array, columns

### 4. Interactive Components

#### `::accordion`
```markdown
::accordion
---
items:
  - title: "How does it work?"
    content: "Detailed explanation here"
  - title: "What's included?"
    content: "Feature list here"
---
::
```
- **Use case**: FAQ sections, detailed feature explanations
- **Props**: items array, allow-multiple, default-open

#### `::tabs`
```markdown
::tabs
---
tabs:
  - title: "For Cafes"
    content: "Cafe-specific content"
  - title: "For Restaurants" 
    content: "Restaurant-specific content"
---
::
```
- **Use case**: Segmented content, different user types
- **Props**: tabs array, default-tab

### 5. Content Enhancement Components

#### `::callout`
```markdown
::callout{type="success" title="Pro Tip"}
Important information that stands out from regular content
::
```
- **Use case**: Important notes, tips, warnings
- **Props**: type (info/success/warning/error), title, icon

#### `::quote`
```markdown
::quote{author="Steve Jobs" source="Apple Keynote"}
"Innovation distinguishes between a leader and a follower."
::
```
- **Use case**: Inspirational quotes, expert opinions
- **Props**: author, source, large (boolean)

### 6. Media Components

#### `::video-embed`
```markdown
::video-embed{src="https://youtube.com/watch?v=..." title="Product Demo"}
Optional fallback content if video doesn't load
::
```
- **Use case**: Product demos, explainer videos
- **Props**: src, title, autoplay, controls

#### `::image-gallery`
```markdown
::image-gallery
---
images:
  - src: "/gallery1.jpg"
    alt: "Description"
  - src: "/gallery2.jpg"
    alt: "Description"
---
::
```
- **Use case**: Product galleries, before/after shots
- **Props**: images array, columns, lightbox

### 7. Conversion Components

#### `::pricing-card`
```markdown
::pricing-card{title="Pro Plan" price="$29/month" popular="true"}
- Feature 1
- Feature 2
- Feature 3
::
```
- **Use case**: Pricing tables, plan comparisons
- **Props**: title, price, currency, popular, features

#### `::call-to-action`
```markdown
::call-to-action{title="Ready to get started?" button-text="Start Free Trial"}
Supporting text that encourages action
::
```
- **Use case**: Section CTAs, conversion points
- **Props**: title, button-text, button-url, secondary-button

## Enhanced Cafe Landing Page Example

```markdown
---
title: SDCHI Open - create this months business hours with ease
description: Tired of making images of calendars for instagram? try SDCHI Open today!
status: private-beta
---

::hero{title="Stop making calendars. Start making coffee." subtitle="Your business hours, handled. Your focus, restored." image="/cafe-hero.jpg"}
Tired of recreating the same business hours calendar every month? SDCHI Open handles it automatically, so you can focus on what you do best - running your cafe.
::

::cta-private-beta
Get early access - Join the private beta
::

::split-card{image="/monthly-calendar-pain.jpg" image-position="right"}
## Why waste time on monthly scheduling?

Every month, the same tedious routine: creating new business hours calendars, updating social media, making sure customers know when you're open. Meanwhile, your coffee is getting cold and your customers are waiting.

**SDCHI Open makes it simple.**

Set your business hours once, and we'll handle the rest. Automatic calendar generation, seamless updates, and more time for what matters most - perfecting your craft and serving your community.
::

::feature-grid
---
features:
  - title: "More brewing, less scheduling"
    description: "Never manually create another business hours calendar. Your time is better spent serving customers."
    icon: "☕"
  - title: "Set it once. Focus on what matters."
    description: "Business hours on autopilot for busy cafe owners - because your energy belongs behind the counter, not behind a computer."
    icon: "⚡"
  - title: "Automated scheduling for independent cafes"
    description: "Business hours management that just works, designed specifically for cafe owners who have better things to do."
    icon: "🎯"
---
::

::split-card{image="/dashboard-preview.jpg" image-position="left"}
## How it works

1. **Set your hours once** - Tell us your regular business hours and any special schedules
2. **We handle the rest** - Automatic calendar generation and updates across all your channels  
3. **Focus on your customers** - Get back to what you love doing most
::

::testimonial-grid
---
testimonials:
  - quote: "I used to spend 2 hours every month creating calendar posts. Now it's completely automated!"
    author: "Maria Santos"
    role: "Owner, Corner Cafe"
    avatar: "/maria.jpg"
  - quote: "Finally, a tool that understands how small cafes actually work."
    author: "David Chen" 
    role: "Manager, Bean There Coffee"
    avatar: "/david.jpg"
---
::

::cta-private-beta
Ready to reclaim your time? Join the waitlist
::
```

## Implementation Priority

### Phase 1 (Essential)
1. `::hero` - Landing page headers
2. `::split-card` - Feature explanations  
3. `::feature-grid` - Benefits display
4. `::callout` - Important information

### Phase 2 (Conversion)
5. `::testimonial` - Social proof
6. `::pricing-card` - Product pricing
7. `::call-to-action` - Generic CTAs

### Phase 3 (Enhancement)
8. `::accordion` - FAQ sections
9. `::stats` - Metrics display
10. `::video-embed` - Product demos

## Technical Implementation Notes

### Component Registration
- Components should be placed in `app/components/content/`
- Nuxt will auto-register components with PascalCase names
- Use `::kebab-case` syntax in markdown

### Styling Guidelines  
- Use Tailwind CSS classes for consistency
- Support responsive design (mobile-first)
- Include dark mode support where applicable
- Ensure accessibility (ARIA labels, keyboard navigation)

### Props Validation
- Use TypeScript interfaces for component props
- Provide sensible defaults
- Include prop validation and error handling

### Content Integration
- Support both slot content and props-based content
- Handle markdown rendering within components
- Ensure proper SEO metadata extraction