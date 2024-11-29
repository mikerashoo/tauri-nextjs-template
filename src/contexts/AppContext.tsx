import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  count: number;
  increment: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);

  return (
    <AppContext.Provider value={{ count, increment }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
