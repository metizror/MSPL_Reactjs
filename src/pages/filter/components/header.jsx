import React, { useContext } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { UrlNavigation } from 'utils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import _ from 'lodash';
import { selectedDataContext } from '../../../context/selectedData';
import {
  dataTypesData,
  locationTypesData,
} from '../../../data-layer/data-layer';
import BreadCrumbs from './breadcrumbs';
import DataTypes from './data-types';
import Location from './location';
import { responsiveDataContext } from '../../../context/responsiveContext';

export default function Header() {
  const [responsiveContext] = useContext(responsiveDataContext);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = React.useState(1);
  const [selectedDataState, setselectedDataState] =
    useContext(selectedDataContext);
  const countriesData = selectedDataState.location;
  const disableEnergytypeTabs = (energyType, index, energy) => {
    let newEnab = false;
    energy.datatypes.types.forEach((i) => {
      if (_.difference(countriesData, i.allowedCountries).length === 0) {
        newEnab = true;
      }
    });
    energy.datatypes?.sub &&
      energy.datatypes?.sub?.forEach((f) => {
        f.types.forEach((i) => {
          if (_.difference(countriesData, i.allowedCountries).length === 0)
            newEnab = true;
        });
        f?.sub &&
          f?.sub?.forEach((g) => {
            g.types.forEach((i) => {
              if (_.difference(countriesData, i.allowedCountries).length === 0)
                newEnab = true;
            });
          });
      });
    if (!newEnab || selectedDataState?.dataTypes?.units === undefined)
      return !newEnab;

    if (
      selectedDataState?.dataTypes?.units &&
      !_.union(
        ...energy.datatypes.types
          .map((i) => i.units)
          .map((i) => i.map((g) => g.unit))
      ).includes(selectedDataState?.dataTypes?.units)
    )
      return true;

    if (!selectedDataState?.dataTypes?.units) {
      return false;
    }
    let enabled = false;
    energy.datatypes.types.forEach((i) => {
      i.units.forEach((g) => {
        if (g.unit === selectedDataState?.dataTypes?.units && !enabled) {
          if (!_.difference(countriesData, i.allowedCountries).length)
            enabled = true;
        }
      });
    });
    return !enabled;
  };

  const onClickTab = (tab) => () => {
    setCurrentTab(tab);
  };
  const OnClickEnergy = (energy) => () => {
    const currVal = selectedDataState.energyTypes
      ? selectedDataState.energyTypes
      : [];
    currVal.push(energy);
    setselectedDataState({
      ...selectedDataState,
      energyTypes: currVal,
      currentEnergyType: energy,
    });
  };

  const getTab = (tab) => {
    switch (tab) {
      case 1:
        return (
          <div
            className="stepwizard-steps-content setup-content panel-primary panel active"
            id="step-1"
          >
            <DataTypes />
          </div>
        );
      default:
        return (
          <div
            className="stepwizard-steps-content setup-content panel-primary panel"
            id="step-3"
          >
            <Location
              locationTypesData={locationTypesData}
              dataTypesData={dataTypesData}
            />
          </div>
        );
    }
  };

  const selectedSlideScroll = () =>
    dataTypesData.findIndex(
      (x) => x.key === selectedDataState.currentEnergyType
    );

  const getCount = (energyKey) => {
    let count = 0;
    if (selectedDataState.dataTypes.energy) {
      selectedDataState.dataTypes.energy.forEach((element) => {
        if (element.key === energyKey) {
          count += 1;
        } else {
          dataTypesData.forEach((element2) => {
            if (element2.datatypes.sub) {
              element2.datatypes.sub.forEach((element3) => {
                if (
                  element3.key === element.key &&
                  energyKey === element2.key
                ) {
                  count += 1;
                } else if (element3.sub) {
                  element3.sub.forEach((element4) => {
                    if (
                      element4.key === element.key &&
                      energyKey === element2.key
                    ) {
                      count += 1;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    return count;
  };

  React.useEffect(() => {
    if (!selectedDataState.currentEnergyType) {
      setselectedDataState({
        ...selectedDataState,
        currentEnergyType: dataTypesData[0].key,
      });
    }
  }, [selectedDataState, currentTab, setselectedDataState]);

  return (
    <div className="brd-selection">
      <BreadCrumbs />

      <div className="stepwizard">
        <div className="stepwizard-row setup-panel">
          <div className="row m-0">
            <div className="stepwizard-step col p-0">
              <button
                type="button"
                onClick={onClickTab(1)}
                className={`stepwizard-step-link  ${
                  currentTab === 1 && 'active'
                } ${
                  currentTab === 1 &&
                  selectedDataState?.dataTypes?.energy?.length > 0 &&
                  'selection-complete active'
                } ${
                  currentTab !== 1 &&
                  selectedDataState.dataTypes?.energy?.length &&
                  'completed'
                }`}
              >
                Energy and data type
              </button>
            </div>
            <div className="stepwizard-step col p-0">
              <button
                type="button"
                onClick={onClickTab(2)}
                // TODO: Change in logic to show click
                className={`stepwizard-step-link  ${
                  currentTab === 2 && 'active'
                }
                ${
                  currentTab === 2 &&
                  selectedDataState.location &&
                  selectedDataState.location.length &&
                  'selection-complete active'
                } ${
                  currentTab !== 2 &&
                  selectedDataState.location &&
                  selectedDataState.location.length &&
                  'completed'
                }`}
              >
                Location
              </button>
            </div>
            {responsiveContext && (
              <div className="stepwizard-step col p-0">
                <div className="tooltip-wrapper">
                  <button
                    type="button"
                    disabled={
                      !(
                        selectedDataState.dataTypes.units &&
                        selectedDataState?.location.length
                      )
                    }
                    onClick={() => {
                      navigate(UrlNavigation(selectedDataState));
                    }}
                  >
                    View charts
                  </button>
                  <span disabled="" className="small-tooltip--text">
                    You must select an energy and data type and a location to
                    continue
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {currentTab === 1 && (
        <div className="energy-type-slider">
          <Slider
            dots={false}
            slidesToShow={1}
            slidesToScroll={1}
            variableWidth
            outerEdgeLimit
            initialSlide={selectedSlideScroll()}
          >
            {dataTypesData.map((energy, index) => (
              <button
                key={energy.key}
                type="button"
                onClick={OnClickEnergy(energy.key)}
                disabled={disableEnergytypeTabs(energy.key, index, energy)}
                className={`col energy-type-tag  ${
                  energy.key === selectedDataState.currentEnergyType &&
                  'active-type-tag'
                }`}
              >
                <span>{energy.title}</span>
                {getCount(energy.key) !== 0 && (
                  <span className="counternumber">{getCount(energy.key)}</span>
                )}
              </button>
            ))}
          </Slider>
        </div>
      )}
      <div className="stepwizard-steps-content--wrapper">
        <form>{getTab(currentTab)}</form>
      </div>
    </div>
  );
}
