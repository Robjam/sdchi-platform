# Landing Page Image Requirements

## Overview

This document outlines the detailed specifications for images used in the SDCHI Open cafe landing page components. These images are referenced in the marketing components implemented for `content/solutions/open/cafe.md`.

## Image Specifications

### 1. `/cafe-hero.jpg` (Hero Section Background)

**Component**: `::hero`
**Position**: Background image with 20% opacity
**Dimensions**: Recommended 1920x1080 or higher
**Format**: JPG (optimized for web)

**Visual Description**:
A warm, inviting cafe interior shot taken from a customer's perspective. The image should show:
- A cozy, well-lit cafe with natural lighting streaming through large windows
- A skilled barista behind the espresso machine, focused on crafting coffee
- Customers sitting at wooden tables with laptops and coffee cups
- Warm color palette with browns, creams, and soft golds
- Subtle depth of field to create a welcoming atmosphere
- The image will be used with low opacity as a background, so it should have good contrast areas for text overlay

**Mood**: Welcoming, professional, authentic cafe atmosphere
**Key Elements**: Natural lighting, active barista, comfortable seating, coffee equipment

### 2. `/monthly-calendar-pain.jpg` (Problem image)

**Component**: `::split-card` (right-positioned)
**Position**: Right side of split-card layout
**Dimensions**: Recommended 800x600 or 4:3 aspect ratio
**Format**: JPG

**Visual Description**:
A split-screen or before/after style image showing the frustration of manual calendar creation:
### 2. `/monthly-calendar-pain.jpg` (Problem image)

**Dimensions**: Recommended 800x600 or 4:3 aspect ratio
**Format**: JPG

**Visual Description**:
A split-screen or before/after style image showing the frustration of manual calendar creation:
Owner is a Japanese woman in her 30s.

**Left Side**:
- A stressed cafe owner behind the counter at her cafe, surrounded by:
  - An appointment book with lots of scribbles
  - A Tablet, facing the owner with some photo editing software that looks very compicated
  **Mood**: Cluttered, stressful, time-consuming, overwhelming


**Right Side**:
- looking over the shoulder of same owner looking calm, in the mid-day with:
  - a smartphone with a preview calendar
  **Mood**: Calm, non-stressed, simple

### 3. `/dashboard-preview.jpg` (Solution Preview)

**Component**: `::split-card` (left-positioned)
**Position**: Left side of split-card layout
**Dimensions**: Recommended 1200x800 or 3:2 aspect ratio
**Format**: JPG (screenshot/mockup)

**Visual Description**:
A clean, modern interface screenshot showing the SDCHI Open dashboard:

**Main Interface**:
- Simple business hours input form on the left panel
- Live preview of generated calendar on the right panel
- Toggle switches for different days of the week
- Special hours section for holidays/events

**Design Elements**:
- Modern UI with clean typography and plenty of white space
- Soft shadows and rounded corners
- Professional color scheme (blues/teals with white background)
- Mobile-responsive preview showing how it looks on different devices
- Visual indicators of automation (subtle icons showing sync/automation)

**Mood**: Clean, efficient, modern, user-friendly
**Key Elements**: Intuitive interface, automated features, professional design, ease of use

## Visual Style Guidelines

All images should maintain consistency with these principles:

### Color Palette
- **Primary**: Warm, coffee-shop inspired colors (rich browns, creams, soft golds)
- **Secondary**: Modern tech blues and teals for dashboard elements
- **Accent**: Clean whites and soft grays for contrast

### Photography Style
- **Quality**: High-resolution, professional photography
- **Lighting**: Natural, well-balanced lighting
- **Composition**: Clean, uncluttered compositions that support text overlay
- **Authenticity**: Real cafe environments rather than overly polished stock photos

### Interface Design
- **Style**: Modern, minimal interface design
- **Typography**: Clean, readable fonts
- **Spacing**: Generous white space and clear visual hierarchy
- **Interaction**: Subtle shadows, rounded corners, and clear call-to-action elements

### Emotional Connection
All images should evoke:
- **Relief**: From tedious manual processes
- **Efficiency**: Clean, automated solutions  
- **Focus**: Ability to concentrate on core business (coffee and customers)
- **Trust**: Professional, reliable software interface

## Technical Requirements

### File Optimization
- **Compression**: Optimize for web delivery while maintaining quality
- **Alt Text**: Each image should have descriptive alt text for accessibility
- **Responsive**: Images should work well at different screen sizes
- **Loading**: Consider lazy loading for performance

### Accessibility
- **Contrast**: Ensure sufficient contrast for text overlay (especially hero image)
- **Alt Descriptions**: Meaningful descriptions for screen readers
- **File Size**: Balance quality with load time (aim for under 500KB per image)

## Implementation Notes

These images are referenced in the following components:
- `app/components/content/Hero.vue` - uses `image` prop
- `app/components/content/SplitCard.vue` - uses `image` and `imageAlt` props

The components are designed to handle missing images gracefully, but optimal visual impact requires all three images to be implemented according to these specifications.