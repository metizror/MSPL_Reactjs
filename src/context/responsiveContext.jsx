import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const responsiveDataContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [responsiveContext, setResponsiveContext] = useState({
    isMobile: false,
  });

  return (
    <responsiveDataContext.Provider
      value={[responsiveContext, setResponsiveContext]}
    >
      {children}
    </responsiveDataContext.Provider>
  );
};

ResponsiveProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
