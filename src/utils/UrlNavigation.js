export const UrlNavigation = (selectedDataState, splitUrl = '', type = '') => {
  let uri = '/results';
  if (
    (splitUrl && splitUrl.search('ep/') !== -1) ||
    (selectedDataState && selectedDataState.energyPrice !== '')
  ) {
    uri += `/ep/${selectedDataState.energyPrice}/unit/${selectedDataState.energyPriceUnit}/`;
    if (selectedDataState.quickCalculations) {
      uri += `calc/${selectedDataState.quickCalculations}/`;
    }
  } else if (selectedDataState && selectedDataState.dataTypes.units) {
    const allCountries = selectedDataState?.location;
    const energyDataTypeUrlKey = [];
    selectedDataState.dataTypes.energy.forEach((element) => {
      element.types.forEach((subElement) => {
        energyDataTypeUrlKey.push(`${element.key}-${subElement.key}`);
      });
    });
    if (selectedDataState.lastRemovedItem.location) {
      uri += `/et/${energyDataTypeUrlKey.join('/')}/unit/${
        selectedDataState.dataTypes.units
      }/regions/${selectedDataState.lastRemovedItem.location}/`;
    } else {
      uri += `/et/${energyDataTypeUrlKey.join('/')}/unit/${
        selectedDataState.dataTypes.units
      }/regions/${allCountries.join('/')}/`;
    }

    if (selectedDataState.quickCalculations && type !== 'table') {
      uri += `calc/${selectedDataState.quickCalculations}/`;
    }
  }
  if (type === '') {
    type = setChartTypeOnCondition(selectedDataState);
  }

  if (
    selectedDataState.dataTypes.units ||
    (selectedDataState && selectedDataState.energyPrice !== '')
  ) {
    uri += `view/${type}`;
  }
  return uri;
};
function setChartTypeOnCondition(selectedDataState, type = 'area') {
  if (selectedDataState.dataTypes.energy?.length >= 2) {
    type = 'line';
  }
  if (
    selectedDataState.dataTypes.energy &&
    (selectedDataState.dataTypes.energy.filter((x) => x.key === 'enind')
      .length > 0 ||
      selectedDataState.dataTypes.units === 'TCM' ||
      selectedDataState.dataTypes.units === 'Years')
  ) {
    type = 'bar';
  }
  return type;
}
