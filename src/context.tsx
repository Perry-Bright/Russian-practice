import React, { createContext, useContext, useState, useEffect } from 'react';
import { TestResult, Question } from './types';
import questionsData from './data/questions.json';

interface AppState {
  history: TestResult[];
  saveResult: (result: TestResult) => void;
  questions: Question[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('testHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveResult = (result: TestResult) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('testHistory', JSON.stringify(newHistory));
  };

  return (
    <AppContext.Provider value={{ history, saveResult, questions: questionsData as Question[] }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
