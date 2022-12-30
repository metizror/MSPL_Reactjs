import React, { useContext } from 'react';
import _ from 'lodash';
import configmaster from 'data/configmaster.json';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectedDataContext } from '../../../context/selectedData';
import glyphsCrossSmall from '../../../assets/images/icons/glyphs-cross-small.svg';
import glyphsChevronDownPurple from '../../../assets/images/icons/glyphs-chevron-down-purple.svg';
import glyphsChevronUpPurple from '../../../assets/images/icons/glyphs-chevron-up-purple.svg';
import glyphsClearIcon from '../../../assets/images/icons/clear-icon.svg';
import { UrlNavigation } from '../../../utils';

export default function BreadCrumbs({ onResultPage = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDataState, setselectedDataState, clearSelectedDataState] =
    useContext(selectedDataContext);
  const [displayLengthLocation, setdisplayLengthLocation] = React.useState(4);
  const [loadMoreLocation, setloadMoreLocation] = React.useState(
    displayLengthLocation === 4
  );
  const [displayLengthEnergy, setdisplayLengthEnergy] = React.useState(4);
  const [loadMoreEnergy, setloadMoreEnergy] = React.useState(
    displayLengthEnergy === 4
  );

  const removeEnergyType = (value) => () => {
    let errorbar = false;
    let obj = [];
    if (
      selectedDataState.dataTypes.energy.length === 1 &&
      selectedDataState?.location?.length !== 0
    ) {
      obj = { energy: [value], units: selectedDataState.dataTypes.units };
      errorbar = true;
    }

    const index = selectedDataState.dataTypes.energy.indexOf(value);

    if (index > -1) {
      selectedDataState.dataTypes.energy.splice(index, 1);
    }
    const indexUnits = selectedDataState.energyTypes.indexOf(value.key);
    if (indexUnits > -1) {
      selectedDataState.energyTypes.splice(indexUnits, 1);
    }
    if (selectedDataState.dataTypes.energy.length === 0) {
      selectedDataState.dataTypes.units = '';
    }
    setselectedDataState({
      ...selectedDataState,
      errorbar,
      dataTypes: selectedDataState.dataTypes,
      lastRemovedItem: obj,
    });
    onResultPage && navigateUrlOnContextChange();
  };

  const removeType = (type, energyData, typesData, unit) => () => {
    let errorbar = false;
    let obj = [];
    const typeKey = [];
    selectedDataState?.dataTypes?.energy.map((energy, energyIndex) => {
      energy?.types.map((types) => {
        if (typeKey.includes(types.key) === false) {
          typeKey.push(types.key);
        }
        return true;
      });
      return true;
    });
    if (typeKey.length === 1 && selectedDataState?.location.length !== 0) {
      errorbar = true;
    }
    selectedDataState.dataTypes.energy.forEach((element, index) => {
      element.types.forEach((element2, index2) => {
        if (element2.key === type) {
          element.types.splice(index2, 1);
        }
      });
    });
    selectedDataState.dataTypes.energy.forEach((element, index) => {
      selectedDataState.dataTypes.energy =
        selectedDataState.dataTypes.energy.filter((x) => x.types.length !== 0);
    });

    if (selectedDataState.dataTypes.energy.length === 0) {
      selectedDataState.dataTypes.units = '';
    }

    if (errorbar) {
      energyData.types = [typesData];
      obj = { energy: [energyData], units: unit };
    }
    setselectedDataState({
      ...selectedDataState,
      errorbar,
      dataTypes: selectedDataState.dataTypes,
      lastRemovedItem: obj,
    });
    onResultPage && navigateUrlOnContextChange();
  };

  const onClickShowLessLocation = () => {
    if (loadMoreLocation)
      setdisplayLengthLocation(selectedDataState.location.length);
    else setdisplayLengthLocation(4);
    setloadMoreLocation(!loadMoreLocation);
  };

  const onClickShowLessEnergy = () => {
    if (loadMoreEnergy)
      setdisplayLengthEnergy(selectedDataState?.dataTypes?.energy?.length);
    else setdisplayLengthEnergy(4);
    setloadMoreEnergy(!loadMoreEnergy);
  };

  const clearAll = () => {
    clearSelectedDataState();
  };

  const removeCountry = (removedCountry) => {
    let errorbar = false;
    let obj = selectedDataState.dataTypes;
    if (
      selectedDataState.dataTypes.energy.length !== 0 &&
      selectedDataState?.location?.length === 1
    ) {
      errorbar = true;
      obj = {
        ...selectedDataState.dataTypes,
        ...{ location: removedCountry },
      };
    }
    const regionArr = selectedDataState.location;
    _.remove(regionArr, (country) => country === removedCountry);
    setselectedDataState({
      ...selectedDataState,
      location: regionArr,
      lastRemovedItem: obj,
      errorbar,
    });
    if (selectedDataState.location.length === 0) {
      onResultPage && navigate('/results/');
      return;
    }
    onResultPage && navigateUrlOnContextChange();
  };

  const navigateUrlOnContextChange = () => {
    const splitUrl = location.pathname.split('results/')[1];
    if (document.getElementById('spinner')) {
      document.getElementById('spinner').style.display = 'block';
    }
    const url = UrlNavigation(
      selectedDataState,
      splitUrl,
      splitUrl.split('view/')[1]
    );
    navigate(url);
  };

  const breadCrumbsUnitRender = () => {
    const typeKey = [];
    return selectedDataState?.dataTypes?.energy.map((energy, energyIndex) => (
      <div key={energyIndex}>
        {energy?.types.map((types) => {
          if (typeKey.includes(types.key) === false) {
            typeKey.push(types.key);
            return (
              <div key={types.key}>
                <button type="button" className="brc-btn chian-btn">
                  <span>{types.title}</span>
                </button>
                <button type="button" className="brc-btn">
                  <span>{selectedDataState?.dataTypes?.units}</span>
                  <img
                    src={glyphsCrossSmall}
                    alt=""
                    onClick={removeType(
                      types.key,
                      energy,
                      types,
                      selectedDataState?.dataTypes?.units
                    )}
                  />
                </button>
              </div>
            );
          }
          return false;
        })}
      </div>
    ));
  };

  React.useEffect(() => {
    if (displayLengthLocation > 4 && !loadMoreLocation) {
      setdisplayLengthLocation(selectedDataState.location.length);
    } else {
      setdisplayLengthLocation(4);
    }
  }, [displayLengthLocation, loadMoreLocation, selectedDataState.location]);
  if (
    selectedDataState?.dataTypes?.energy?.length > 0 ||
    selectedDataState?.dataTypes?.units ||
    selectedDataState.location?.length > 0
  )
    return (
      <div className="breadcrums">
        <div className="row">
          <div className="col-md-3">
            <div className="tag-container">
              <span className="tags">
                <div className="brc-title">Energy</div>
                {selectedDataState?.dataTypes?.energy
                  ?.slice(0, displayLengthEnergy)
                  .map((val) => (
                    <button key={val.key} type="button" className="brc-btn">
                      <span>{configmaster[val.key]}</span>
                      <img
                        onClick={removeEnergyType(val)}
                        src={glyphsCrossSmall}
                        alt=""
                      />
                    </button>
                  ))}

                {selectedDataState?.dataTypes?.energy?.length > 4 && (
                  <div>
                    {loadMoreEnergy ? (
                      <div className="morebtns">
                        <button
                          type="button"
                          onClick={onClickShowLessEnergy}
                          className="more-btn"
                        >
                          <span>
                            {`+  ${
                              selectedDataState?.dataTypes?.energy?.length - 4
                            } More`}
                          </span>
                          <img src={glyphsChevronDownPurple} alt="" />
                        </button>
                      </div>
                    ) : (
                      <div className="morebtns">
                        <button
                          type="button"
                          className="more-btn"
                          onClick={onClickShowLessEnergy}
                        >
                          <span>Collapse</span>
                          <img src={glyphsChevronUpPurple} alt="" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="tag-container">
              <span className="tags">
                <div className="brc-title">Unit</div>
                {selectedDataState?.dataTypes?.units && (
                  <div>{breadCrumbsUnitRender()}</div>
                )}
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div className="tag-container">
              <div className="tags">
                <div className="brc-title">Location</div>
                {selectedDataState.location
                  .slice(0, displayLengthLocation)
                  .map((country) => (
                    <button key={country} type="button" className="brc-btn">
                      <span>{configmaster[country]}</span>
                      <img
                        onClick={() => {
                          removeCountry(country);
                        }}
                        src={glyphsCrossSmall}
                        alt=""
                      />
                    </button>
                  ))}

                {selectedDataState.location.length > 4 && (
                  <div>
                    {loadMoreLocation ? (
                      <div className="morebtns">
                        <button
                          type="button"
                          onClick={onClickShowLessLocation}
                          className="more-btn"
                        >
                          <span>
                            {`+ ${selectedDataState.location.length - 4} More`}
                          </span>
                          <img src={glyphsChevronDownPurple} alt="" />
                        </button>
                      </div>
                    ) : (
                      <div className="morebtns">
                        <button
                          type="button"
                          className="more-btn"
                          onClick={onClickShowLessLocation}
                        >
                          <span>Collapse</span>
                          <img src={glyphsChevronUpPurple} alt="" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {onResultPage || (
          <div className="clear-part">
            <div className="clear-all">
              <button onClick={clearAll} type="button" className="clr-btn">
                <span>
                  <img alt="" src={glyphsClearIcon} />
                </span>
                <span className="clr-txt">Clear all</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );

  return '';
}
