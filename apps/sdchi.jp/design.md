# SDCHI Design System

## Brand Colors

The SDCHI brand identity is built around fresh, vibrant greens extracted from the logo (`public/SDCHI.svg`), creating an organic, approachable, and energetic feel that's perfect for a non-tech service.

### Logo Color Analysis

From `SDCHI.svg`:
- **Bright Lime Green**: `#80b944` - The vibrant, fresh face of the brand
- **Deep Forest Green**: `#3b8236` - The grounded, reliable foundation

## Color Palette

### Primary - Lime Green Family
The hero of our palette. Fresh, energetic, and inviting.

| Shade | Hex       | RGB           | Usage                                    |
|-------|-----------|---------------|------------------------------------------|
| 50    | `#f7fdf0` | 247, 253, 240 | Subtle backgrounds, hover states         |
| 100   | `#eefbdc` | 238, 251, 220 | Light backgrounds, cards                 |
| 200   | `#dcf7b9` | 220, 247, 185 | Soft highlights, borders                 |
| 300   | `#bfef84` | 191, 239, 132 | Muted accents, secondary buttons         |
| 400   | `#a3e455` | 163, 228, 85  | Bright accents, active states            |
| 500   | `#80b944` | 128, 185, 68  | **Primary brand color** - CTAs, headers  |
| 600   | `#6ba037` | 107, 160, 55  | Hover states, darker accents             |
| 700   | `#568029` | 86, 128, 41   | Text on light backgrounds                |
| 800   | `#45661e` | 69, 102, 30   | Dark text, borders                       |
| 900   | `#354d17` | 53, 77, 23    | Darkest text, emphasis                   |

### Secondary - Forest Green Family
Depth and sophistication. Grounding and trustworthy.

| Shade | Hex       | RGB           | Usage                                    |
|-------|-----------|---------------|------------------------------------------|
| 50    | `#f2f8f1` | 242, 248, 241 | Subtle sage backgrounds                  |
| 100   | `#e0f0dd` | 224, 240, 221 | Light sage sections                      |
| 200   | `#c1e1bc` | 193, 225, 188 | Soft forest accents                      |
| 300   | `#8fc785` | 143, 199, 133 | Medium sage elements                     |
| 400   | `#5da750` | 93, 167, 80   | Vibrant forest accents                   |
| 500   | `#3b8236` | 59, 130, 54   | **Core forest** - Secondary CTAs         |
| 600   | `#2f6a2b` | 47, 106, 43   | Deep forest highlights                   |
| 700   | `#265422` | 38, 84, 34    | Dark forest text                         |
| 800   | `#1f431b` | 31, 67, 27    | Very dark elements                       |
| 900   | `#183616` | 24, 54, 22    | Near-black forest text                   |

### Accent - Citrus/Energy
Warmth and vitality. For highlights and calls to action.

| Shade | Hex       | RGB           | Usage                                    |
|-------|-----------|---------------|------------------------------------------|
| 50    | `#fffef0` | 255, 254, 240 | Cream backgrounds                        |
| 100   | `#fffcd1` | 255, 252, 209 | Pale yellow sections                     |
| 200   | `#fff8a3` | 255, 248, 163 | Light citrus highlights                  |
| 300   | `#fff165` | 255, 241, 101 | Bright lemon accents                     |
| 400   | `#ffe627` | 255, 230, 39  | Vibrant citrus elements                  |
| 500   | `#f5d400` | 245, 212, 0   | **Golden lime** - Warning, highlights    |
| 600   | `#d4b000` | 212, 176, 0   | Deep gold                                |
| 700   | `#a88700` | 168, 135, 0   | Rich gold text                           |
| 800   | `#866a00` | 134, 106, 0   | Dark gold                                |
| 900   | `#6d5600` | 109, 86, 0    | Bronze, darkest gold                     |

### Neutral - Earth Tones
Natural sophistication. For text, backgrounds, and structure.

| Shade | Hex       | RGB           | Usage                                    |
|-------|-----------|---------------|------------------------------------------|
| 50    | `#fafaf8` | 250, 250, 248 | Off-white, page backgrounds              |
| 100   | `#f2f2ed` | 242, 242, 237 | Light earth sections                     |
| 200   | `#e8e8df` | 232, 232, 223 | Soft beige, dividers                     |
| 300   | `#d4d4c5` | 212, 212, 197 | Medium earth borders                     |
| 400   | `#b8b8a3` | 184, 184, 163 | Warm gray, muted text                    |
| 500   | `#8f8f7a` | 143, 143, 122 | Earth tone text                          |
| 600   | `#6e6e5e` | 110, 110, 94  | Deep earth, body text                    |
| 700   | `#545449` | 84, 84, 73    | Dark earth, headings                     |
| 800   | `#3f3f38` | 63, 63, 56    | Charcoal earth                           |
| 900   | `#2b2b25` | 43, 43, 37    | Near-black, emphasis text                |

## Semantic Colors

### Success
- Use **Primary 500** (`#80b944`) - The fresh lime green conveys success naturally
- Lighter variants (300-400) for backgrounds
- Darker variants (600-700) for text

### Warning
- Use **Accent 500** (`#f5d400`) - Golden lime for attention without alarm
- Lighter variants (200-300) for warning backgrounds
- Darker variants (600-700) for warning text

### Error
- **Red-Orange**: `#d84315` (RGB: 216, 67, 21)
- Warm red that complements the green palette without clashing
- Use sparingly for critical errors and destructive actions

### Info
- **Bright Blue**: `#0288d1` (RGB: 2, 136, 209)
- Clean blue provides contrast against the green-dominant palette
- For informational messages and links

## Usage Guidelines

### Color Hierarchy

1. **Primary (Lime)** - Main brand interactions
   - Primary CTAs
   - Navigation highlights
   - Hero sections
   - Interactive elements

2. **Secondary (Forest)** - Supporting elements
   - Secondary CTAs
   - Section backgrounds
   - Feature highlights
   - Depth and layering

3. **Accent (Citrus)** - Emphasis and energy
   - Special offers
   - Important highlights
   - Hover states for variety
   - Warning states

4. **Neutral (Earth)** - Structure and readability
   - Body text
   - Backgrounds
   - Borders and dividers
   - Form inputs

### Accessibility

#### Contrast Ratios
Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text):

**Good Text Combinations:**
- Primary 700-900 on Primary 50-100 ✓
- Primary 50-200 on Primary 700-900 ✓
- Secondary 700-900 on Secondary 50-100 ✓
- Neutral 700-900 on Neutral 50-100 ✓
- Primary/Secondary 500 on white (with caution, test contrast)

**Avoid:**
- Mid-tones (400-600) on white for small text
- Light tones (100-300) on mid-tones (400-600)

### Design Principles

1. **Fresh & Organic** - Lead with lime green to convey vitality and natural appeal
2. **Grounded & Trustworthy** - Balance brightness with forest greens for stability
3. **Warm & Inviting** - Use citrus accents sparingly to add warmth
4. **Natural Elegance** - Earth neutrals provide sophistication without coldness
5. **High Contrast** - Ensure readability with proper shade selection

## Tailwind Configuration

Add to `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f7fdf0',
        100: '#eefbdc',
        200: '#dcf7b9',
        300: '#bfef84',
        400: '#a3e455',
        500: '#80b944',
        600: '#6ba037',
        700: '#568029',
        800: '#45661e',
        900: '#354d17',
      },
      secondary: {
        50: '#f2f8f1',
        100: '#e0f0dd',
        200: '#c1e1bc',
        300: '#8fc785',
        400: '#5da750',
        500: '#3b8236',
        600: '#2f6a2b',
        700: '#265422',
        800: '#1f431b',
        900: '#183616',
      },
      accent: {
        50: '#fffef0',
        100: '#fffcd1',
        200: '#fff8a3',
        300: '#fff165',
        400: '#ffe627',
        500: '#f5d400',
        600: '#d4b000',
        700: '#a88700',
        800: '#866a00',
        900: '#6d5600',
      },
      neutral: {
        50: '#fafaf8',
        100: '#f2f2ed',
        200: '#e8e8df',
        300: '#d4d4c5',
        400: '#b8b8a3',
        500: '#8f8f7a',
        600: '#6e6e5e',
        700: '#545449',
        800: '#3f3f38',
        900: '#2b2b25',
      },
      error: '#d84315',
      success: '#80b944',
      warning: '#f5d400',
      info: '#0288d1',
    }
  }
}
```

## Examples

### Hero Section
- Background: `primary-50` or gradient from `primary-100` to `white`
- Heading: `primary-900` or `secondary-900`
- Subtext: `neutral-700`
- CTA: `bg-primary-500 hover:bg-primary-600 text-white`

### Card
- Background: `white` or `neutral-50`
- Border: `neutral-200` or `primary-200`
- Heading: `primary-800`
- Text: `neutral-700`
- Accent: `secondary-400` for icons/badges

### Navigation
- Background: `white` or `primary-50`
- Link: `neutral-700 hover:text-primary-600`
- Active: `text-primary-600 border-b-2 border-primary-600`

### Forms
- Input background: `white` or `neutral-50`
- Border: `neutral-300 focus:border-primary-500`
- Label: `neutral-700`
- Error: `error` with `error` background at 10% opacity
- Success: `success` with `success` background at 10% opacity
