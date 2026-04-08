import React, { createContext, useContext, useState, useCallback } from 'react';

const DesignContext = createContext();

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};

export const DesignProvider = ({ children }) => {
  const [activePhase, setActivePhase] = useState('Library');
  
  // Global Engineering State (Single Source of Truth)
  const [activeStackup, setActiveStackup] = useState({
    height: 0.2,      // Dielectric Height H1 (mm)
    height2: 0.2,     // Dielectric Height H2 (mm)
    width: 0.18,      // Trace Width W (mm)
    thickness: 0.035, // Copper Thickness T (mm)
    spacing: 0.2,     // Intra-pair Spacing S (mm)
    dk: 4.17,         // Dielectric Constant Er
    df: 0.016,        // Loss Tangent
    surfaceRoughness: 2.0, // Copper roughness Rz (um)
    material: 'Isola 370HR',
    ipcClass: 2,      // 1: General, 2: Dedicated, 3: High Reliability
    targetImpedance: 100 // Ohms
  });

  const updateStackup = useCallback((updates) => {
    setActiveStackup(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const value = {
    activePhase,
    setActivePhase,
    activeStackup,
    updateStackup
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};
