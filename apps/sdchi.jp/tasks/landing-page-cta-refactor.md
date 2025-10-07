# Detailed Prose Integration Refactoring Plan

## Overview
The components currently use `not-prose` classes to escape Tailwind Typography styling. The better approach is to embrace prose and override only where necessary using Tailwind's prose modifier classes.

---

## 1. **Hero Component** (`Hero.vue`)

**Current Issues:**
- Lines 4, 9, 13, 17: Using `not-prose` to completely escape prose styling
- Fighting against prose instead of working with it
- Manual text sizing (`text-4xl`, `text-lg`) and colors

**Refactoring Strategy:**

### Remove from Component:
1. **Line 4**: Remove `not-prose` from image tag (images are fine in prose)
2. **Line 9**: Remove `not-prose` from h1, use `prose-headings:` modifiers instead
3. **Line 13**: Remove `not-prose` from subtitle paragraph
4. **Line 17**: Remove `not-prose` from slot wrapper

### Add to Parent Container (Line 2):
```vue
<div class="prose prose-lg dark:prose-invert max-w-none
             prose-headings:text-center prose-headings:tracking-tight
             prose-h1:text-4xl sm:prose-h1:text-6xl prose-h1:font-bold
             prose-p:text-center prose-p:text-gray-600 dark:prose-p:text-gray-300
             prose-p:max-w-3xl prose-p:mx-auto
             relative bg-gradient-to-b from-gray-50 to-white
             dark:from-gray-900 dark:to-gray-800 rounded-md">
```

### Refactored Template:
```vue
<template>
  <div class="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-center prose-headings:tracking-tight
              prose-h1:text-4xl sm:prose-h1:text-6xl prose-h1:font-bold prose-h1:text-gray-900 dark:prose-h1:text-white
              prose-p:text-center prose-p:leading-8 prose-p:max-w-3xl prose-p:mx-auto
              relative bg-gradient-to-b from-gray-50 to-white
              dark:from-gray-900 dark:to-gray-800 rounded-md">
    <div v-if="image" class="absolute inset-0 z-0 not-prose">
      <img :src="image" :alt="title" class="w-full h-full object-cover opacity-20" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="mt-6">{{ subtitle }}</p>
      <div v-if="$slots.default" class="mt-8 max-w-2xl mx-auto">
        <Slot :use="$slots.default" unwrap="p" />
      </div>
    </div>
  </div>
</template>
```

**Benefits:**
- Cleaner markup (no inline utility classes on semantic elements)
- Typography scales consistently via prose
- Easier to maintain color scheme changes
- Preserves white background gradient, font sizes, centered alignment

---

## 2. **SplitCard Component** (`SplitCard.vue`)

**Current Issues:**
- Line 23: **Already using prose correctly!** ✓
- But prose wrapper is deeply nested, could be elevated

**Refactoring Strategy:**

### Current Structure Works Well
This component already embraces prose on line 23:
```vue
<div class="prose prose-lg max-w-none dark:prose-invert">
```

### Minor Optimization (Optional):
Move prose utility overrides to parent for consistency:

```vue
<template>
  <div class="py-16 bg-white dark:bg-gray-900 rounded-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <!-- Content Column -->
        <div :class="{
          'lg:order-1': imagePosition === 'right',
          'lg:order-2': imagePosition === 'left'
        }"
        class="prose prose-lg max-w-none dark:prose-invert
               prose-h2:text-gray-900 dark:prose-h2:text-white
               prose-p:text-gray-600 dark:prose-p:text-gray-300
               prose-strong:text-gray-900 dark:prose-strong:text-white">
          <slot />
        </div>

        <!-- Image Column -->
        <div v-if="image" :class="{
          'lg:order-2': imagePosition === 'right',
          'lg:order-1': imagePosition === 'left'
        }">
          <img :src="image" :alt="imageAlt || 'Feature illustration'"
               class="w-full h-auto rounded-lg shadow-xl" />
        </div>
      </div>
    </div>
  </div>
</template>
```

**Benefits:**
- Maintains existing white background
- Typography already managed by prose
- Adds explicit color control for dark mode
- No breaking changes needed—this component is already optimal

---

## 3. **FeatureGrid Component** (`FeatureGrid.vue`)

**Current Issues:**
- Line 9: Using `not-prose` on grid items
- Lines 11, 15, 19: Manual text sizing and colors
- Component receives data via props, not markdown content

**Refactoring Strategy:**

### Key Decision Point:
This component **doesn't render markdown content**—it renders prop data. The `not-prose` here might be defensive (in case parent has prose).

### Recommended Approach:
**Keep `not-prose`** at the root but standardize typography to match prose scales:

```vue
<template>
  <div class="not-prose py-16 bg-gray-50 dark:bg-gray-800 rounded-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8" :class="{
        'grid-cols-1 md:grid-cols-2': columns === 2,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4
      }">
        <div v-for="(feature, index) in features" :key="index"
             class="text-center"
             :class="{ 'md:text-center': centerAlign }">

          <div v-if="feature.icon" class="text-4xl mb-4">
            {{ feature.icon }}
          </div>

          <!-- Match prose-xl h3 sizing -->
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
            {{ feature.title }}
          </h3>

          <!-- Match prose-lg p sizing -->
          <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
```

**Changes Made:**
- Line 1: Keep `not-prose` (this isn't prose content)
- Line 13: Icon margin `mb-1` → `mb-4` for better spacing
- Line 16: Keep `text-xl` but add `leading-tight` to match prose-headings
- Line 17: Add `mb-3` for consistent spacing
- Line 20: Change to `text-base` (16px) to match prose default paragraph size

**Benefits:**
- Maintains gray background
- Typography sizes align with prose system
- Still isolated from parent prose contamination
- Cleaner visual hierarchy

---

## 4. **CtaSection Component** (`CtaSection.vue`)

**Current Issues:**
- Line 2: `not-prose` on root wrapper
- Lines 11-16, 24-29: Manual text sizing throughout
- Complex form styling that shouldn't be affected by prose
- Dark slate background (intentional design)

**Refactoring Strategy:**

### Keep `not-prose` Root
This component is **entirely custom UI** (forms, buttons, styled cards). Prose would break it.

### Standardize Typography Scales:
Align text sizes with prose equivalents without applying prose:

```vue
<template>
  <div class="not-prose bg-slate-800/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-700/50 shadow-2xl">

    <!-- Already Signed Up State -->
    <div v-if="isAlreadySignedUp" class="text-center">
      <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <!-- prose-lg equivalent = text-lg/1.75rem -->
      <h2 class="text-lg font-semibold mb-2 text-white leading-tight">
        {{ savedData.name || 'お客様' }}、お帰りなさいませ
      </h2>
      <!-- prose-base equivalent = text-base/1rem -->
      <p class="text-base text-gray-300 mb-2 leading-relaxed">
        {{ signupConfig.alreadySignedUpText }}
      </p>
      <p class="text-sm text-gray-400 leading-normal">
        {{ savedData.company }} • {{ savedData.email }}
      </p>
      <button @click="resetSignup" class="text-blue-400 hover:text-blue-300 underline text-sm mt-3">
        別のメールアドレスで登録する
      </button>
    </div>

    <!-- Signup Form State -->
    <div v-else class="grid grid-cols-2 gap-6 items-start py-4">
      <!-- Left Column: Marketing Copy -->
      <div>
        <!-- prose-xl equivalent for emphasis = text-xl -->
        <h2 class="text-xl mb-4 font-bold leading-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {{ signupConfig.headline }}
        </h2>
        <!-- prose-base = text-base -->
        <p class="text-base text-gray-300 mb-6 leading-relaxed">
          <slot>{{ signupConfig.description }}</slot>
        </p>

        <!-- Trust Indicators - keep text-sm for supporting content -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
            </svg>
            <span>安全なデータ管理</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>営業メールは一切送りません</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Form (keep as-is, forms shouldn't use prose) -->
      <div>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <!-- Form fields unchanged -->
          <!-- ... -->
        </form>
      </div>
    </div>
  </div>
</template>
```

**Key Changes:**
- Line 2: Keep `not-prose` (essential for custom UI)
- Line 11: `text-lg` → matches prose-lg heading
- Line 12: Add `mb-2` for better spacing, add `text-white` for explicit color
- Line 15: `text-sm` → `text-base` to match prose body text
- Line 16: Add `mb-2` and `leading-relaxed`
- Line 17: Add `leading-normal`
- Line 20: `mt-2` → `mt-3`
- Line 28: Keep `text-xl` (equivalent to prose-xl)
- Line 29: Add `leading-tight`
- Line 32: `text-sm` → `text-base`, add `leading-relaxed`

**Benefits:**
- Preserves dark slate background and custom styling
- Typography scales align with prose system
- Forms remain unaffected by typography styles
- Better vertical rhythm with adjusted margins
- Explicit color declarations for dark theme

---

## Summary of Changes

| Component | Strategy | Key Changes |
|-----------|----------|-------------|
| **Hero** | Embrace prose fully | Remove all `not-prose`, add prose modifiers to parent |
| **SplitCard** | Already optimal | Minor: Add explicit color overrides via prose-* modifiers |
| **FeatureGrid** | Keep isolated, align scales | Keep `not-prose`, adjust margins and use prose-equivalent sizes |
| **CtaSection** | Keep isolated, align scales | Keep `not-prose`, standardize text sizes to match prose |

## Implementation Order

1. **SplitCard** (lowest risk, already uses prose)
2. **Hero** (moderate complexity, clear win)
3. **FeatureGrid** (low risk, minor adjustments)
4. **CtaSection** (complex component, careful testing needed)

## Testing Checklist

After implementing each component:
- [ ] Verify white backgrounds are preserved (Hero, SplitCard)
- [ ] Verify gray backgrounds are preserved (FeatureGrid)
- [ ] Verify dark slate background is preserved (CtaSection)
- [ ] Check font sizes match original design
- [ ] Test dark mode variants
- [ ] Verify centered alignment where applicable (Hero)
- [ ] Test responsive breakpoints
- [ ] Validate form functionality (CtaSection)
