import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const selectedDataContext = createContext();

export const SelectedDataProvider = ({ children }) => {
  const initialState = {
    energyTypes: [],
    currentEnergyType: '',
    dataTypes: {},
    quickCalculations: '',
    errorbar: false,
    lastRemovedItem: [],
    location: [],
    energyPrice: '',
    energyPriceUnit: '',
  };
  const [selectedDataState, setselectedDataState] = useState(initialState);

  const clearSelectedDataState = () => {
    setselectedDataState(initialState);
  };
  return (
    <selectedDataContext.Provider
      value={[selectedDataState, setselectedDataState, clearSelectedDataState]}
    >
      {children}
    </selectedDataContext.Provider>
  );
};

SelectedDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
