'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type PortfolioData } from '@/types';
import { getPortfolioData } from '@/utils/dataLoader';
import { processSkillCategory, processAchievement } from '@/utils/iconMapper';

interface PortfolioDataContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

interface PortfolioDataProviderProps {
  children: React.ReactNode;
}

export function PortfolioDataProvider({ children }: PortfolioDataProviderProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const portfolioData = await getPortfolioData();
      
      // Process the data to convert string icons to components
      const processedData: PortfolioData = {
        ...portfolioData,
        skillCategories: portfolioData.skillCategories.map(processSkillCategory),
        achievements: portfolioData.achievements.map(processAchievement)
      };
      
      setData(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load portfolio data';
      setError(errorMessage);
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const contextValue: PortfolioDataContextType = {
    data,
    loading,
    error,
    refetch: fetchData
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

export function useProjects() {
  const { data, loading, error } = usePortfolioData();
  return { projects: data?.projects || [], loading, error };
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