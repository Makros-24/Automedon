'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'theme';

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

/*
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than copied into state from an effect. Reading it
 * during render (instead of after paint) also removes the flash of the default
 * theme that the previous setState-in-effect approach produced.
 */
const listeners = new Set<() => void>();

/*
 * Holds the current choice when localStorage is unavailable (private browsing
 * can throw on write). Without it a failed write would leave the snapshot
 * unchanged and the toggle would silently do nothing.
 */
let overrideTheme: Theme | null = null;

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keeps the theme consistent when it is changed in another tab. A write from
  // elsewhere is newer than this tab's choice, so it clears the override.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      overrideTheme = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function readStoredTheme(): Theme | null {
  if (overrideTheme) return overrideTheme;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    // Private browsing modes can throw on access.
    return null;
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  ...props
}: ThemeProviderProps) {
  const getSnapshot = useCallback(
    () => readStoredTheme() ?? defaultTheme,
    [defaultTheme]
  );

  // The server has no localStorage, so it always renders the default theme and
  // the client reconciles on hydration.
  const getServerSnapshot = useCallback(() => defaultTheme, [defaultTheme]);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Syncing the class list to the document is an external-system write, which
  // is what effects are for - no state is set here.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    overrideTheme = newTheme;
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Not persisted, but the override keeps it applied for this session.
    }
    emitChange();
  }, []);

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
