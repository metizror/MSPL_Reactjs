import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const featuredReportContext = createContext();

export const FeaturedReportProvider = ({ children }) => {
  const [featuredReportState, setfeaturedReportState] = useState(false);

  return (
    <featuredReportContext.Provider
      value={[featuredReportState, setfeaturedReportState]}
    >
      {children}
    </featuredReportContext.Provider>
  );
};

FeaturedReportProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
