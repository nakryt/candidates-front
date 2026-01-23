# Lazy Loading Implementation

This document describes the lazy loading strategy implemented throughout the frontend application to improve initial load performance and optimize bundle splitting.

## Overview

The application uses React's `lazy()` and `Suspense` to implement code splitting for components that aren't needed on initial page load. This reduces the initial JavaScript bundle size and improves Time to Interactive (TTI).

## Lazy-Loaded Components

### 1. CandidateGrid (`entities/candidate/ui/CandidateGrid.tsx`)
- **Why:** Heavy component that renders the candidate list
- **When loaded:** When candidates data is available (after loading state)
- **Preloading:** Automatically preloaded when data arrives
- **Fallback:** LazyLoadFallback with "Loading candidates..." message

### 2. CandidateDetails (`entities/candidate/ui/CandidateDetails.tsx`)
- **Why:** Only needed when user clicks "View Details" on a candidate
- **When loaded:** On-demand when modal opens
- **Preloading:** Triggered on card hover/focus for instant modal opening
- **Fallback:** LazyLoadFallback with "Loading candidate details..." message

### 3. Modal (`shared/ui/Modal.tsx`)
- **Why:** Modal dialog only needed for detail view
- **When loaded:** On-demand when viewing candidate details
- **Preloading:** Triggered on card hover/focus
- **Fallback:** InlineLoadingFallback

### 4. ErrorScreen (`shared/states/ErrorScreen.tsx`)
- **Why:** Only shown when an error occurs
- **When loaded:** When API call fails
- **Preloading:** None (error scenario)
- **Fallback:** LazyLoadFallback

### 5. EmptyState (`shared/states/EmptyState.tsx`)
- **Why:** Only shown when no candidates match filters
- **When loaded:** When filtered results are empty
- **Preloading:** None (edge case)
- **Fallback:** LazyLoadFallback

## Architecture

### Error Boundaries
All lazy-loaded components are wrapped with `ErrorBoundary` to gracefully handle:
- Network failures during code splitting
- Component rendering errors
- Failed chunk loading

Error boundaries provide:
- User-friendly error messages
- Retry functionality
- Fallback UI that doesn't break the entire app

### Loading Fallbacks
Three types of loading fallbacks are provided:

1. **LazyLoadFallback** - Default fallback with customizable height and message
2. **InlineLoadingFallback** - Minimal spinner for inline contexts
3. **FullScreenLoadingFallback** - For major route transitions (not currently used)

### Preloading Strategy

The app uses an advanced preloading strategy via `lazyWithPreload.ts`:

```typescript
const { lazy: Component, preload: preloadComponent } = lazyWithPreload(
  () => import('./Component')
);
```

**Preloading triggers:**
1. **Data availability** - Grid preloads when candidates data arrives
2. **User intent signals** - Modal/details preload on card hover/focus
3. **Before interaction** - Components preload before user clicks

This ensures:
- Instant UI response on user interaction
- No visible loading states for preloaded components
- Minimal performance overhead (preload only on user intent)

## Performance Benefits

### Before Lazy Loading
- Single large bundle with all components
- Longer initial load time
- Wasted bandwidth for unused components

### After Lazy Loading
- Smaller initial bundle (~30-40% reduction expected)
- Faster Time to Interactive (TTI)
- Components loaded on-demand
- Better caching granularity

### Bundle Analysis
To analyze bundle sizes:
```bash
npm run build
```

Check the build output for chunk sizes. Main expected chunks:
- `main.js` - Core app + critical components
- `CandidateGrid-[hash].js` - Grid component
- `CandidateDetails-[hash].js` - Details modal
- `Modal-[hash].js` - Modal component
- Additional smaller chunks for state screens

## Usage Guidelines

### When to Use Lazy Loading

**Good candidates:**
- Modal dialogs and overlays
- Heavy components (charts, editors, complex forms)
- Components behind user interactions
- Route/page components
- Feature modules not needed initially

**Avoid lazy loading:**
- Critical path components (needed for First Contentful Paint)
- Very small components (overhead > benefit)
- Frequently used utilities
- Components in loops (causes multiple chunk requests)

### Adding New Lazy-Loaded Components

1. **Convert to default export:**
```typescript
const MyComponent: FC<Props> = (props) => {
  // component code
};

export default MyComponent;
```

2. **Use lazyWithPreload in parent:**
```typescript
import { lazyWithPreload } from '../shared/lib/lazyWithPreload';

const { lazy: MyComponent, preload: preloadMyComponent } = lazyWithPreload(
  () => import('./MyComponent')
);
```

3. **Wrap with Suspense and ErrorBoundary:**
```typescript
<ErrorBoundary>
  <Suspense fallback={<LazyLoadFallback />}>
    <MyComponent {...props} />
  </Suspense>
</ErrorBoundary>
```

4. **Add preloading (optional but recommended):**
```typescript
// On hover
<div onMouseEnter={preloadMyComponent}>

// On data availability
useEffect(() => {
  if (shouldPreload) {
    preloadMyComponent();
  }
}, [shouldPreload]);
```

## Testing

### Manual Testing
1. Open DevTools Network tab
2. Filter by "JS"
3. Navigate the app and observe chunk loading
4. Verify components load only when needed
5. Test error scenarios (disable network, throttle)

### Automated Testing
Lazy-loaded components work transparently in tests. No special handling needed:
```typescript
// Tests work the same way
render(<App />);
expect(screen.getByText('Candidates')).toBeInTheDocument();
```

## Troubleshooting

### Issue: "Loading chunk X failed"
**Cause:** Network error or outdated chunk after deployment
**Solution:** Error boundary catches this and shows retry button

### Issue: Flash of loading state on fast networks
**Cause:** Suspense always shows fallback, even briefly
**Solution:** Use preloading to load before user interaction

### Issue: Too many small chunks
**Cause:** Over-aggressive lazy loading
**Solution:** Group related components, avoid lazy loading very small components

## Future Improvements

1. **Route-based code splitting** - When adding React Router
2. **Prefetch on link hover** - Preload route chunks
3. **Service Worker caching** - Cache chunks for offline use
4. **Dynamic imports for libraries** - Lazy load heavy libraries (date pickers, charts)
5. **Progressive enhancement** - Load basic version first, enhance later

## Resources

- [React.lazy() documentation](https://react.dev/reference/react/lazy)
- [Code splitting guide](https://react.dev/learn/code-splitting)
- [Web.dev: Code splitting](https://web.dev/code-splitting/)
