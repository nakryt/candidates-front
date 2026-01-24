import { lazy, type ComponentType } from "react";

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

export function createPreloadHandler(preloadFunc: () => void) {
  return () => {
    try {
      preloadFunc();
    } catch (error) {
      console.warn("Preload failed:", error);
    }
  };
}

export function preloadComponents(preloadFunctions: Array<() => void>) {
  preloadFunctions.forEach((preload) => {
    try {
      preload();
    } catch (error) {
      console.warn("Component preload failed:", error);
    }
  });
}
