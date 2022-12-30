import React, { useState, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import _ from 'lodash';
import { PropTypes } from 'prop-types';
import { selectedDataContext } from '../../../context/selectedData';
import Footer from './footer';
import { responsiveDataContext } from '../../../context/responsiveContext';

export default function Location({ locationTypesData, dataTypesData }) {
  const [selectedDataState, setselectedDataState] =
    useContext(selectedDataContext);
  const fetchAllowedCountries = (selectedEnery) => {
    const energyDataTypeUrlKey = {};
    selectedDataState.dataTypes.energy.forEach((element) => {
      element.types.forEach((subElement) => {
        if (energyDataTypeUrlKey[element.key]) {
          energyDataTypeUrlKey[element.key].push(subElement.key);
        } else {
          energyDataTypeUrlKey[element.key] = [subElement.key];
        }
      });
    });
    const keys = Object.keys(energyDataTypeUrlKey);
    const countries = [];
    dataTypesData.forEach((e) => {
      if (keys.includes(e.key)) {
        e.datatypes.types.forEach((i) => {
          if (energyDataTypeUrlKey[e.key].includes(i.key)) {
            countries.push(i.allowedCountries);
          }
        });
      }
      e.datatypes?.sub &&
        e.datatypes?.sub?.forEach((f) => {
          if (keys.includes(f.key)) {
            f.types.forEach((i) => {
              if (energyDataTypeUrlKey[f.key].includes(i.key)) {
                countries.push(i.allowedCountries);
              }
            });
          }
          f?.sub &&
            f?.sub?.forEach((g) => {
              if (keys.includes(g.key)) {
                g.types.forEach((i) => {
                  if (energyDataTypeUrlKey[g.key].includes(i.key)) {
                    countries.push(i.allowedCountries);
                  }
                });
              }
            });
        });
    });
    return _.intersection(...countries);
  };
  let allowedCountries = false;
  if (selectedDataState?.dataTypes?.energy?.length > 0) {
    allowedCountries = fetchAllowedCountries(
      selectedDataState?.dataTypes?.energy
    );
  }
  const [dropdownValue, setdropdownValue] = React.useState('regions');
  const [selectedRegion, setRegion] = React.useState([0]);
  const [selectedGroup, setGroup] = React.useState([0]);
  const [responsiveContext] = useContext(responsiveDataContext);
  const slick = useState();
  const selectedTab =
    dropdownValue === 'regions' ? selectedRegion : selectedGroup;
  const selectedTabRegionCode =
    locationTypesData[dropdownValue][selectedTab].key;
  const selectedTabRegionTitle =
    locationTypesData[dropdownValue][selectedTab].title;
  const isSubRegionAvailable =
    !!locationTypesData[dropdownValue][selectedTab].subregions;

  const getCountriesFromData = (subRegions) => {
    const countries = [];
    subRegions.forEach((subRegion) => {
      countries.push(...subRegion.countries.map((i) => i.key));
    });
    return countries;
  };

  const selectedTabCountries = locationTypesData[dropdownValue][selectedTab]
    .subregions
    ? getCountriesFromData(
        locationTypesData[dropdownValue][selectedTab].subregions
      )
    : locationTypesData[dropdownValue][selectedTab].countries.map((i) => i.key);

  const availableRegions = locationTypesData[dropdownValue].map(
    (regions) => `t${regions.key}`
  );

  const handleClick = (key) => () => {
    if (dropdownValue === 'regions') {
      setRegion(key);
    } else {
      setGroup(key);
    }
  };

  const allCountriesClick = (arrayOfCountries, state) => {
    let currData = selectedDataState?.location;
    if (state) {
      if (allowedCountries) {
        currData.push(
          ...arrayOfCountries.filter((value) =>
            allowedCountries.includes(value)
          )
        );
      } else {
        currData.push(...arrayOfCountries);
      }
    } else {
      currData = _.difference(currData, arrayOfCountries);
    }
    setselectedDataState({
      ...selectedDataState,
      location: [...new Set(currData)],
    });
  };

  const countyClick = (countryCode) => (event) => {
    const currSelection = selectedDataState?.location;
    if (event.target.checked) {
      currSelection.push(countryCode);
    } else {
      _.remove(currSelection, (ele) => ele === countryCode);
    }
    setselectedDataState({
      ...selectedDataState,
      location: currSelection,
    });
  };

  const checkedValue = (countryCode) => {
    if (selectedDataState.location.includes(countryCode)) {
      return true;
    }
    return false;
  };

  const allCheckedValue = (arrayOfCountries) => {
    if (allowedCountries) {
      const enabledAllowedCountries = arrayOfCountries.filter((value) =>
        allowedCountries?.includes(value)
      ).length;
      return (
        arrayOfCountries.filter((value) =>
          selectedDataState.location.includes(value)
        ).length === enabledAllowedCountries && enabledAllowedCountries > 0
      );
    }
    return (
      arrayOfCountries.filter((value) =>
        selectedDataState.location.includes(value)
      ).length === arrayOfCountries.length
    );
  };

  const isAllDisabled = (arrayOfCountries) => {
    if (allowedCountries) {
      return (
        arrayOfCountries.filter((value) => allowedCountries?.includes(value))
          .length === 0
      );
    }
    return false;
  };

  const groupsOrRegionClick = (state) => {
    if (state) {
      setdropdownValue('groups');
    } else {
      setdropdownValue('regions');
    }
  };

  function displayCount(location) {
    const countries =
      location?.countries?.map((i) => i.key) ||
      location?.subregions
        ?.reduce((previousValue, currentValue) => {
          previousValue.push(...currentValue.countries);
          return previousValue;
        }, [])
        .map((i) => i.key);
    const filteredArray = countries.filter((value) =>
      selectedDataState.location.includes(value)
    );
    if (filteredArray.length > 0) {
      return <span className="counternumber">{filteredArray.length}</span>;
    }
    return <></>;
  }

  function isDisable(countryCode) {
    // if (configMaster[countryCode] === undefined) {
    //   return true;
    // }
    if (selectedDataState?.dataTypes?.energy?.length > 0) {
      return !allowedCountries.includes(countryCode);
    }
    return false;
  }

  const countryRender = (data, i) => {
    const countries = isSubRegionAvailable
      ? locationTypesData[dropdownValue][selectedTab].subregions[i].countries
      : locationTypesData[dropdownValue][selectedTab].countries;

    return (
      <div className="country-selection">
        <div className="row">
          {countries.map((subData, j) => (
            <div key={subData.key} className="col-md-3 col-sm-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={countyClick(subData.key)}
                  checked={checkedValue(subData.key)}
                  disabled={isDisable(subData.key)}
                  name={subData.key}
                  id={subData.key}
                />
                <label className="form-check-label" htmlFor={subData.key}>
                  {subData.title}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const locationTabs = (value) =>
    value.map((location, i) => (
      <li
        key={location.title}
        className={`${
          selectedTabRegionTitle === location.title && 'activated'
        }`}
      >
        <button
          type="button"
          className="energy-type-tag"
          onClick={handleClick(i)}
        >
          <span>{location.title}</span>
          {displayCount(location)}
        </button>
      </li>
    ));
  return (
    <>
      <div className="panel-body pl-0 pr-0">
        <div className="location-main--wrapper">
          <div className="row">
            <div className="col-12">
              <div className="region-selection">
                <div className="row">
                  <div className="col-3 reg-sel">
                    <label
                      onClick={(event) => {
                        groupsOrRegionClick(false);
                      }}
                    >
                      Region
                    </label>

                    <span>
                      <div className="reg-selection">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            checked={dropdownValue === 'groups'}
                            onChange={(event) => {
                              groupsOrRegionClick(event.target.checked);
                            }}
                            id="customSwitches"
                          />
                          <label className="custom-control-label" htmlFor="">
                            <span className="switch">
                              <div className="sliderSwitch round active" />
                            </span>
                          </label>
                        </div>
                      </div>
                    </span>
                    <label
                      onClick={(event) => {
                        groupsOrRegionClick(true);
                      }}
                    >
                      Groups
                    </label>
                  </div>
                  <div className="col-3">
                    <div className="form-check mt-9">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={countyClick('tWORLD')}
                        checked={checkedValue('tWORLD')}
                        disabled={isDisable('tWORLD')}
                        name="tWORLD"
                        id="tWORLD"
                      />
                      <label className="form-check-label">World total</label>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-check mt-9">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={(event) => {
                          allCountriesClick(
                            availableRegions,
                            event.target.checked
                          );
                        }}
                        checked={allCheckedValue(availableRegions)}
                        disabled={isAllDisabled(availableRegions)}
                      />
                      <label className="form-check-label">
                        All {dropdownValue}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="regional_links">
                <ul>
                  {responsiveContext ? (
                    <Slider
                      ref={slick}
                      infinite
                      speed={500}
                      slidesToShow={3}
                      slidesToScroll={1}
                      arrows
                      variableWidth
                    >
                      {locationTypesData[dropdownValue].map((location, i) => (
                        <li
                          key={location.title}
                          className={`${
                            selectedTabRegionTitle === location.title &&
                            'activated'
                          }`}
                        >
                          <button
                            type="button"
                            className="energy-type-tag"
                            onClick={handleClick(i)}
                          >
                            <span>{location.title}</span>
                            {displayCount(location)}
                          </button>
                        </li>
                      ))}
                    </Slider>
                  ) : (
                    locationTabs(locationTypesData[dropdownValue])
                  )}
                </ul>
              </div>
              <div className="selected-region">
                <div className="rg-heading">
                  <div className="row">
                    <div className="col-3">
                      <h4 className="mb-0">{selectedTabRegionTitle}</h4>
                    </div>
                    <div className="col-3">
                      <div className="form-check mt-9">
                        <input
                          onChange={countyClick(`t${selectedTabRegionCode}`)}
                          checked={checkedValue(`t${selectedTabRegionCode}`)}
                          disabled={isDisable(`t${selectedTabRegionCode}`)}
                          className="form-check-input"
                          key={selectedTabRegionCode}
                          name={selectedTabRegionCode}
                          id={`total${selectedTabRegionCode}`}
                          type="checkbox"
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`total${selectedTabRegionCode}`}
                        >
                          {dropdownValue === 'regions' ? 'Regional' : 'Groups'}{' '}
                          total
                        </label>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="form-check">
                        <input
                          id="all"
                          key={selectedTabRegionCode}
                          className="form-check-input"
                          checked={allCheckedValue(selectedTabCountries)}
                          onChange={(event) => {
                            allCountriesClick(
                              selectedTabCountries,
                              event.target.checked
                            );
                          }}
                          disabled={isAllDisabled(selectedTabCountries)}
                          type="checkbox"
                          name="all-countries"
                        />
                        <label htmlFor="all" className="form-check-label">
                          All countries
                        </label>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="form-check">
                        <input
                          key={selectedTabRegionCode}
                          id={`Other ${selectedTabRegionTitle}`}
                          onChange={countyClick(`o${selectedTabRegionCode}`)}
                          checked={checkedValue(`o${selectedTabRegionCode}`)}
                          disabled={isDisable(`o${selectedTabRegionCode}`)}
                          className="form-check-input"
                          type="checkbox"
                          name="other"
                        />
                        <label
                          htmlFor={`Other ${selectedTabRegionTitle}`}
                          className="form-check-label"
                        >
                          {`Other ${selectedTabRegionTitle}`}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isSubRegionAvailable ? (
                <div>
                  {locationTypesData[dropdownValue][selectedTab].subregions.map(
                    (data, i) => {
                      const countries = data.countries.map((item) => item.key);
                      return (
                        <div key={data.title}>
                          <div className="selected-region light-gray-bg mt-10">
                            <div className="rg-heading">
                              <div className="row">
                                <div className="col-3">
                                  <h4 className="mb-0">{data.title}</h4>
                                </div>
                                <div className="col-3">
                                  <div className="form-check mt-9">
                                    <label
                                      htmlFor={data.key}
                                      className="form-check-label"
                                    >
                                      <input
                                        className="form-check-input"
                                        name={data.title}
                                        id={data.key}
                                        onChange={countyClick(`t${data.key}`)}
                                        checked={checkedValue(`t${data.key}`)}
                                        disabled={isDisable(`t${data.key}`)}
                                        type="checkbox"
                                      />
                                      Sub-regional total
                                    </label>
                                  </div>
                                </div>
                                <div className="col-3">
                                  <div className="form-check">
                                    <label
                                      htmlFor={`all${data.key}`}
                                      className="form-check-label"
                                    >
                                      <input
                                        id={`all${data.key}`}
                                        className="form-check-input"
                                        checked={allCheckedValue(countries)}
                                        disabled={isAllDisabled(countries)}
                                        onChange={(event) => {
                                          allCountriesClick(
                                            countries,
                                            event.target.checked
                                          );
                                        }}
                                        type="checkbox"
                                        name="all-countries"
                                      />
                                      All countries
                                    </label>
                                  </div>
                                </div>
                                <div className="col-3">
                                  <div className="form-check">
                                    <input
                                      key={data.key}
                                      onChange={countyClick(`o${data.key}`)}
                                      checked={checkedValue(`o${data.key}`)}
                                      disabled={isDisable(`o${data.key}`)}
                                      id={`Other${data.title}`}
                                      type="checkbox"
                                      name="other"
                                    />
                                    <label
                                      htmlFor={`Other${data.title}`}
                                      className="form-check-label"
                                    >
                                      {`Other ${data.title}`}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            {countryRender(
                              locationTypesData[dropdownValue][selectedTab]
                                .subregions,
                              i
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div>{countryRender(selectedTabRegionCode)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {responsiveContext ? (
        <div className="responsive-footer">
          <Footer />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

Location.propTypes = {
  locationTypesData: PropTypes.node.isRequired,
};
