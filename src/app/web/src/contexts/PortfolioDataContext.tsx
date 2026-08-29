'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { type PortfolioData } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPortfolioData } from '@/utils/dataLoader';
import { processSkillCategory, processAchievement, processContactInfo } from '@/utils/iconMapper';

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

interface PortfolioDataProviderProps {
  children: React.ReactNode;
}

/**
 * Portfolio Data Provider with multi-language support
 *
 * Automatically refetches data when the language changes
 */
export function PortfolioDataProvider({ children }: PortfolioDataProviderProps) {
  const { language } = useLanguage();

  /*
   * The result carries the language and attempt it belongs to, which lets
   * `loading` be derived rather than assigned. Setting loading from inside the
   * effect would mean a synchronous setState on every language change, and it
   * is redundant: a result that does not match the request in flight already
   * means we are loading.
   */
  const [result, setResult] = useState<{
    language: string;
    attempt: number;
    data: PortfolioData | null;
    error: string | null;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);

  const isCurrent = result?.language === language && result?.attempt === attempt;
  const loading = !isCurrent;
  const data = isCurrent ? result.data : null;
  const error = isCurrent ? result.error : null;

  useEffect(() => {
    // Guards against a slow response for a previous language overwriting a
    // newer one, which the old version had no protection against.
    let cancelled = false;

    const load = async () => {
      try {
        const portfolioData = await getPortfolioData(language);
        if (cancelled) return;

        // Process the data to convert string icons to components
        const processedData: PortfolioData = {
          ...portfolioData,
          skillCategories: portfolioData.skillCategories.map(processSkillCategory),
          achievements: portfolioData.achievements.map(processAchievement),
          contactInfo: processContactInfo(portfolioData.contactInfo)
        };

        setResult({ language, attempt, data: processedData, error: null });
      } catch (err) {
        if (cancelled) return;

        const errorMessage = err instanceof Error ? err.message : 'Failed to load portfolio data';
        console.error('Failed to load portfolio data:', err);
        setResult({ language, attempt, data: null, error: errorMessage });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [language, attempt]);

  // Bumping the attempt re-runs the effect above; this is an event handler, so
  // it is free to set state directly.
  const refetch = useCallback(async () => {
    setAttempt(current => current + 1);
  }, []);

  const contextValue: PortfolioDataContextType = {
    data,
    loading,
    error,
    refetch
  };

  return (
    <PortfolioDataContext.Provider value={contextValue}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData(): PortfolioDataContextType {
  const context = useContext(PortfolioDataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}

// Individual data hooks for convenience
export function usePersonalInfo() {
  const { data, loading, error } = usePortfolioData();
  return { personalInfo: data?.personalInfo || null, loading, error };
}

export function useAbout() {
  const { data, loading, error } = usePortfolioData();
  return { about: data?.about || null, loading, error };
}

export function useWork() {
  const { data, loading, error } = usePortfolioData();
  return { work: data?.work || null, loading, error };
}

export function useProjects() {
  const { data, loading, error } = usePortfolioData();
  return { projects: data?.projects || [], loading, error };
}

export function useSideProjects() {
  const { data, loading, error } = usePortfolioData();
  return { sideProjects: data?.sideProjects || [], loading, error };
}

export function useSkillCategories() {
  const { data, loading, error } = usePortfolioData();
  return { skillCategories: data?.skillCategories || [], loading, error };
}

export function useAchievements() {
  const { data, loading, error } = usePortfolioData();
  return { achievements: data?.achievements || [], loading, error };
}

export function useContactInfo() {
  const { data, loading, error } = usePortfolioData();
  return { contactInfo: data?.contactInfo || null, loading, error };
}

export function useFooter() {
  const { data, loading, error } = usePortfolioData();
  return { footer: data?.footer || null, loading, error };
}

interface PortfolioDataContextType {
    data: PortfolioData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}
