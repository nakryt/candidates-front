# Shared Utilities Library

## Lazy Loading Utilities

### `lazyWithPreload.ts`

Advanced lazy loading utility that provides preload capabilities for better UX.

#### `lazyWithPreload<T>(importFunc)`

Creates a lazy-loaded component with preload functionality.

**Returns:**
- `lazy`: Lazy-loaded React component
- `preload`: Function to preload the component before it's needed

**Example:**
```typescript
import { lazyWithPreload } from '@/shared/lib/lazyWithPreload';

const { lazy: MyModal, preload: preloadMyModal } = lazyWithPreload(
  () => import('./MyModal')
);

function App() {
  // Preload on hover for instant opening
  return (
    <button onMouseEnter={preloadMyModal}>
      Open Modal
    </button>
  );
}
```

#### `createPreloadHandler(preloadFunc)`

Creates a safe preload handler that catches errors.

**Example:**
```typescript
const handlePreload = createPreloadHandler(preloadMyComponent);

<div onMouseEnter={handlePreload}>
  Hover to preload
</div>
```

#### `preloadComponents(preloadFunctions)`

Preload multiple components at once.

**Example:**
```typescript
useEffect(() => {
  // Preload all modal-related components together
  preloadComponents([
    preloadModal,
    preloadDetails,
    preloadForm
  ]);
}, []);
```

### Best Practices

1. **Preload on user intent signals:**
   - Hover over buttons that open modals
   - Focus on form fields that load heavy editors
   - Route changes (preload next route)

2. **Don't over-preload:**
   - Only preload components likely to be used
   - Consider network conditions
   - Avoid preloading on mobile with slow connections

3. **Combine with Suspense and ErrorBoundary:**
   ```typescript
   <ErrorBoundary>
     <Suspense fallback={<LazyLoadFallback />}>
       <LazyComponent />
     </Suspense>
   </ErrorBoundary>
   ```

### Loading Fallbacks

See `@/shared/ui/LazyLoadFallback.tsx` for loading components:
- `LazyLoadFallback` - Standard loading state
- `InlineLoadingFallback` - Minimal spinner
- `FullScreenLoadingFallback` - Full page loading

### Error Handling

See `@/shared/ui/ErrorBoundary.tsx` for error boundary component.

Catches:
- Network failures during chunk loading
- Component rendering errors
- Module resolution errors

Provides:
- User-friendly error messages
- Retry functionality
- Graceful degradation
