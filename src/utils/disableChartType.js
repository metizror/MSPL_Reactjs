export const disableChartType = (value, currCalVal) => {
  if (window.location.href.search(value) !== -1) {
    return true;
  }
  if (
    window.location.href.search('natgas-rsrv') !== -1 &&
    (value === 'area' || value === 'column')
  ) {
    return true;
  }
  if (
    window.location.href.search('oil-rp') !== -1 &&
    (value === 'area' || value === 'column')
  ) {
    return true;
  }
  if (
    window.location.href.search('enind-') !== -1 &&
    (value === 'area' || value === 'column')
  ) {
    return true;
  }
  if (
    (currCalVal === 'cg' && (value === 'bar' || value === 'column')) ||
    (currCalVal === 'cpg' && (value === 'area' || value === 'column')) ||
    (currCalVal === 'annual_g' && (value === 'area' || value === 'column'))
  ) {
    return true;
  }
  return false;
};
