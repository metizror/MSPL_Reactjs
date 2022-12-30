import React, { useContext } from 'react';
import { getTitlefromConfig } from 'utils';
import subCatArrowSvg from '../../../assets/images/icons/sub-cat-arrow.svg';
import subSubCatArrowSvg from '../../../assets/images/icons/sub-sub-cat-arrow.svg';
import glyphsInputCheckBoxUnavailable from '../../../assets/images/icons/glyphs-input-check-box-unavailable.svg';
import { selectedDataContext } from '../../../context/selectedData';
import { dataTypesData } from '../../../data-layer/data-layer';
import Footer from './footer';
import { responsiveDataContext } from '../../../context/responsiveContext';

export default function DataTypes() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedDataState, setselectedDataState] =
    useContext(selectedDataContext);
  const onClickValue = (sub, types, units, state) => {
    let energyData = selectedDataState.dataTypes.energy
      ? selectedDataState.dataTypes.energy
      : [];
    if (energyData.length > 0) {
      const energyIndex = energyData.findIndex((x) => x.key === sub.key);
      if (energyIndex >= 0) {
        const currentTypeIndex = energyData[energyIndex].types.findIndex(
          (x) => x.key === types.key
        );
        if (currentTypeIndex >= 0) {
          if (state) {
            energyData[energyIndex].types[currentTypeIndex].sub.push({
              key: sub.key,
              title: sub.title,
            });
          } else {
            energyData[energyIndex].types[currentTypeIndex].sub = energyData[
              energyIndex
            ].types[currentTypeIndex].sub.filter(
              (item) => item.key !== sub.key
            );
            if (
              energyData[energyIndex].types[currentTypeIndex].sub.length === 0
            ) {
              energyData[energyIndex].types = energyData[
                energyIndex
              ].types.filter((item) => item.key !== types.key);
            }
            if (energyData[energyIndex].types.length === 0) {
              energyData = energyData.filter((item) => item.key !== sub.key);
            }
          }
        } else if (state) {
          energyData[energyIndex].types.push({
            key: types.key,
            title: types.title,
            sub: [
              {
                key: sub.key,
                title: sub.title,
              },
            ],
          });
        }
      } else {
        energyData.push({
          key: sub.key,
          types: [
            {
              key: types.key,
              title: types.title,
              sub: [
                {
                  key: sub.key,
                  title: sub.title,
                },
              ],
            },
          ],
        });
      }
    } else {
      energyData.push({
        key: sub.key,
        types: [
          {
            key: types.key,
            title: types.title,
            sub: [
              {
                key: sub.key,
                title: sub.title,
              },
            ],
          },
        ],
      });
    }
    let setData = { units: units.unit, energy: energyData };
    if (energyData.length === 0) {
      setData = [];
    }
    setselectedDataState({
      ...selectedDataState,
      dataTypes: setData,
    });
  };

  const [scrollHeight, setScrollHeight] = React.useState(0);

  const [responsiveContext] = useContext(responsiveDataContext);

  function isDisable(units, types) {
    let boolVal = true;
    if (
      selectedDataState.dataTypes.units === undefined ||
      selectedDataState.dataTypes.units === units.unit ||
      selectedDataState.dataTypes.units === ''
    ) {
      boolVal = false;
    }
    selectedDataState?.location?.forEach((element) => {
      if (!types.allowedCountries.includes(element)) {
        boolVal = true;
      }
    });
    return boolVal;
  }

  React.useEffect(() => {
    if (selectedDataState.currentEnergyType !== undefined) {
      const index = dataTypesData.findIndex(
        (x) => x.key === selectedDataState.currentEnergyType
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedDataState, currentIndex]);

  React.useEffect(() => {
    const heightIncreasedElement =
      document.getElementsByClassName('head-pan-inn');
    setScrollHeight(heightIncreasedElement[0].clientHeight);

    const lis = document.getElementById('datatypeHeader').children;
    let finalWidth = 0;
    for (let i = 0; i <= lis.length - 1; i++) {
      const liWidth = lis[i].offsetWidth + 15;
      finalWidth += liWidth;
    }
    finalWidth += 40;

    const ele = document.getElementById('panel-heading-scroll');
    if (ele !== null) {
      document.getElementById(
        'panel-heading-scroll'
      ).style.minWidth = `${finalWidth}px`;
    }

    const ele2 = document.getElementById('dummyID');
    if (ele2 !== null) {
      document.getElementById('dummyID').style.minWidth = 'auto';
    }
  });

  const checkedValue = (sub, types, units) => {
    if (selectedDataState.dataTypes.units) {
      const energyIndex = selectedDataState.dataTypes.energy.findIndex(
        (x) => x.key === sub.key
      );
      if (
        energyIndex >= 0 &&
        selectedDataState.dataTypes.units === units.unit &&
        sub.key === selectedDataState.dataTypes.energy[energyIndex].key
      ) {
        const currentTypeIndex = selectedDataState.dataTypes.energy[
          energyIndex
        ].types.findIndex((x) => x.key === types.key);
        if (
          currentTypeIndex >= 0 &&
          selectedDataState.dataTypes.energy[energyIndex].types[
            currentTypeIndex
          ].key === types.key
        ) {
          const subTypeIndex = selectedDataState.dataTypes.energy[
            energyIndex
          ].types[currentTypeIndex].sub.findIndex((x) => x.key === sub.key);
          if (
            subTypeIndex >= 0 &&
            selectedDataState.dataTypes.energy[energyIndex].types[
              currentTypeIndex
            ].sub[subTypeIndex].key === sub.key
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };
  const isDataUnavailable = (sub, types, units) => {
    const htmlMarkUp = [];
    sub.types.forEach((element) => {
      if (element.key === types.key) {
        element.units.forEach((unit) => {
          if (unit.unit === units.unit) {
            htmlMarkUp.push(
              <div
                className="form-control-box"
                key={sub.key + element.key + units.unit}
              >
                <input
                  onChange={(event) => {
                    onClickValue(sub, types, units, event.target.checked);
                  }}
                  checked={checkedValue(sub, types, units)}
                  type="checkbox"
                  disabled={isDisable(units, types)}
                  className="form-check-input"
                />
              </div>
            );
          } else if (sub.key !== selectedDataState.currentEnergyType) {
            htmlMarkUp.push(
              <div
                className="cross"
                key={`cross${sub.key}${unit.unit}${types.key}`}
              >
                <img alt="" src={glyphsInputCheckBoxUnavailable} />
              </div>
            );
          }
        });
      }
    });
    if (htmlMarkUp.length === 0) {
      htmlMarkUp.push(
        <div className="cross" key={`cross${sub.key}${types.key}`}>
          <img alt="" src={glyphsInputCheckBoxUnavailable} />
        </div>
      );
    }
    return htmlMarkUp;
  };

  return (
    <>
      <div
        className="panel-heading"
        id={`${scrollHeight >= 69 ? 'panel-heading-scroll' : 'dummyID'}`}
      >
        <div className="head-panel">
          <div className="head-pan-inn" id="datatypeHeader">
            <div className="hd-block hd-title-block" />
            {dataTypesData[currentIndex].datatypes.types.map((data) => (
              <div key={data.key} className="hd-block">
                <div className="energy-title">{data.title}</div>
                <ul className="ene-types">
                  {data.units.map((subdata) => (
                    <li
                      key={data.key + subdata.unit}
                      className="tooltip-wrapper"
                    >
                      <div className="ene-type-data">
                        <span>{subdata.unit}</span>
                      </div>
                      <p className="desc-tooltip--text">
                        <span className="">{subdata.hovertext}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="energy-main-content">
          <div className="energy-row">
            <div className="hd-energy-row">
              <div className="hd-block hd-title-block">
                <div className="ene-left-title">
                  {getTitlefromConfig(selectedDataState.currentEnergyType)}
                </div>
              </div>
              {dataTypesData[currentIndex].datatypes.types.map((data) => (
                <div className="hd-block" key={data.key}>
                  <div className="energy-title hidden-title">{data.title}</div>
                  <ul className="ene-types">
                    {data.units.map((units) => (
                      <li key={units.unit}>
                        {isDataUnavailable(
                          dataTypesData[currentIndex].datatypes,
                          data,
                          units
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="clearfix" />
            </div>
          </div>

          {dataTypesData[currentIndex].datatypes.sub &&
            dataTypesData[currentIndex].datatypes.sub.map((sub) => (
              <div key={sub.key} className="energy-row sub-row">
                <div className="hd-energy-row">
                  <div className="hd-block hd-title-block">
                    <div className="ene-left-title">
                      <span>
                        <img alt="" src={subCatArrowSvg} />
                      </span>
                      <span>{sub.title}</span>
                    </div>
                  </div>
                  {dataTypesData[currentIndex].datatypes.types.map((types) => (
                    <div key={sub.key + types.key} className="hd-block">
                      <div className="energy-title hidden-title">
                        {types.title}
                      </div>
                      <ul className="ene-types">
                        {types.units.map((units) => (
                          <li key={sub.key + types.key + units.unit}>
                            {isDataUnavailable(sub, types, units)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="clearfix" />
                </div>
                {sub.sub &&
                  sub.sub.map((subdata) => (
                    <div key={sub.key + subdata.key}>
                      <div className="hd-energy-row sub-sub-row">
                        <div className="hd-block hd-title-block">
                          <div className="ene-left-title ">
                            <span>
                              <img alt="" src={subSubCatArrowSvg} />
                            </span>
                            <span>{subdata.title}</span>
                          </div>
                        </div>
                        {dataTypesData[currentIndex].datatypes.types.map(
                          (types) => (
                            <div
                              key={sub.key + subdata.key + types.key}
                              className="hd-block"
                            >
                              <div className="energy-title hidden-title">
                                {types.title}
                              </div>
                              <ul className="ene-types">
                                {types.units.map((unit) => (
                                  <li
                                    key={
                                      sub.key +
                                      subdata.key +
                                      types.key +
                                      unit.unit
                                    }
                                  >
                                    {isDataUnavailable(subdata, types, unit)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                        <div className="clearfix" />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
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
