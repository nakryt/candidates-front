import { lazy, type ComponentType } from "react";

/**
 * Factory function that returns an object with:
 * - lazy: Lazy-loaded component
 * - preload: Function to preload the component before it's needed
 *
 * Usage:
 * const { lazy: MyComponent, preload: preloadMyComponent } = lazyWithPreload(() => import('./MyComponent'));
 *
 * // Preload on hover or before navigation
 * <button onMouseEnter={preloadMyComponent}>Click me</button>
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithPreload<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
) {
  let componentPromise: Promise<{ default: T }> | null = null;

  const preload = () => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  };

  const LazyComponent = lazy(() => {
    if (!componentPromise) {
      componentPromise = importFunc();
    }
    return componentPromise;
  });

  return {
    lazy: LazyComponent,
    preload,
  };
}

/**
 * Higher-order function to create a preload handler for events
 * Useful for preloading on mouse enter, focus, etc.
 *
 * Usage:
 * const handleMouseEnter = createPreloadHandler(preloadMyComponent);
 * <div onMouseEnter={handleMouseEnter}>...</div>
 */
export function createPreloadHandler(preloadFunc: () => void) {
  return () => {
    try {
      preloadFunc();
    } catch (error) {
      // Silently catch preload errors - component will load normally when needed
      console.warn("Preload failed:", error);
    }
  };
}

/**
 * Preload multiple components at once
 *
 * Usage:
 * preloadComponents([preloadModal, preloadDetails, preloadGrid]);
 */
export function preloadComponents(preloadFunctions: Array<() => void>) {
  preloadFunctions.forEach((preload) => {
    try {
      preload();
    } catch (error) {
      console.warn("Component preload failed:", error);
    }
  });
}
