import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const energyPriceDataContext = createContext();

export const EnergyPriceDataProvider = ({ children }) => {
  const [energyPriceContext, setEnergyPriceContext] = useState({
    energyPrice: '',
    unit: '',
    quickCalculations: '',
  });

  return (
    <energyPriceDataContext.Provider
      value={[energyPriceContext, setEnergyPriceContext]}
    >
      {children}
    </energyPriceDataContext.Provider>
  );
};

EnergyPriceDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
