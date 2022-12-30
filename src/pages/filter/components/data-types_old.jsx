import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { selectedDataContext } from '../../../context/selectedData';

export default function DataTypes({ dataTypesData, selectedDataTypes }) {
  // TODO: Need to find a better approach to acheive following
  const [selectedData, setselectedData] = React.useState({});
  const [selectedStep, setselectedStep] = React.useState(0);
  const [isExpand, setExpand] = React.useState(false);
  const [isShowToolTip, setShowToolTip] = React.useState(true);
  const [selectedDataState, setselectedDataState] =
    useContext(selectedDataContext);
  const selectedEnergyTypes = selectedDataState?.energyTypes;

  React.useEffect(() => {
    setselectedDataState({
      ...selectedDataState,
      dataTypes: selectedData,
    });
  }, [selectedData]);

  React.useEffect(() => {
    if (Object.entries(selectedDataTypes).length > 0) {
      setselectedData(selectedDataTypes);
    }
  }, []);

  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const isDisabled = (allowedEnergytypes) =>
    checker(allowedEnergytypes, selectedEnergyTypes) ? '' : 'not-selected-blur';

  const handleFirstClick = (data, allowedEnergyTypes, key) => () => {
    if (
      !checker(allowedEnergyTypes, selectedEnergyTypes) ||
      (selectedData['sub-units-data-checked'] &&
        Object.values(selectedData['sub-units-data-checked']).length > 0 &&
        selectedData.units !== data)
    ) {
      return false;
    }
    setselectedData({ ...selectedData, units: data, 'units-key': key });
    setselectedDataState({
      ...selectedDataState,
      dataTypes: selectedData,
    });
    setselectedStep(1);
    return true;
  };

  const handleSecondClick = (data, key) => () => {
    if (
      selectedData['sub-units-data-checked'] &&
      Object.values(selectedData['sub-units-data-checked']).length > 0 &&
      selectedData['sub-units'] !== data
    ) {
      return false;
    }
    setselectedData({
      ...selectedData,
      'sub-units': data,
      'sub-units-key': key,
    });
    setselectedDataState({
      ...selectedDataState,
      dataTypes: selectedData,
    });
    setselectedStep(2);
    return true;
  };

  const handleThirdClick = (data, key) => () => {
    setselectedData({
      ...selectedData,
      'sub-units-data': [data],
      'sub-units-data-key': [key],
    });
    setselectedDataState({
      ...selectedDataState,
      dataTypes: selectedData,
    });
    setExpand(true);
  };

  const handleChange = (data) => (event) => {
    if (data === 'no_sub') {
      setExpand(false);
    }
    const currentValue = selectedData['sub-units-data-checked']
      ? selectedData['sub-units-data-checked']
      : [];
    currentValue[event.target.name] = event.target.checked;

    const keys = Object.keys(currentValue);
    for (let i = 0; i < keys.length; i += 1) {
      if (currentValue[keys] === false) {
        delete currentValue[keys];
      }
    }

    setselectedData({
      ...selectedData,
      'sub-units-data-checked': currentValue,
    });
  };

  const onTotalClick = (event) => {
    if (event.target.checked) {
      setselectedData({
        ...selectedData,
        'sub-units-total': event.target.name,
      });
    } else {
      delete selectedData['sub-units-total'];
      setselectedData({ ...selectedData });
    }
  };

  const onSubUnitsTotalClick = (event) => {
    const currentValue = selectedData['sub-units-data-total']
      ? selectedData['sub-units-data-total']
      : [];
    currentValue[event.target.name] = event.target.checked;

    const keys = Object.keys(currentValue);
    for (let i = 0; i < keys.length; i += 1) {
      if (currentValue[keys] === false) {
        delete currentValue[keys];
      }
    }

    setselectedData({
      ...selectedData,
      'sub-units-data-total': currentValue,
    });
  };

  const handleBack = () => {
    setselectedStep(selectedStep - 1);
  };

  const onClickToolTip = (e) => {
    e.stopPropagation();
    setShowToolTip(true);
  };

  return (
    <>
      <div className="panel-heading">
        <h4 className="panel-title">Select units(s)</h4>
      </div>
      <div className="panel-body pl-0 pr-0">
        <div className="data-type-main--wrapper">
          <div className="row">
            <div className="col-12">
              <div className="units-selection--wrapper">
                {selectedStep === 0 ? (
                  <div className="units-selection--items">
                    {dataTypesData.map((data) => (
                      <div
                        key={data.key}
                        className="units-selection--item has-child"
                      >
                        <button
                          type="button"
                          className={`info units-selection--link ${isDisabled(
                            data.allowedEnergyTypes
                          )}  ${
                            selectedData['sub-units-data-checked'] &&
                            data.title !== selectedData.units &&
                            Object.values(
                              selectedData['sub-units-data-checked']
                            ).length !== 0
                              ? 'not-selected-blur'
                              : ''
                          }`}
                          onClick={handleFirstClick(
                            data.title,
                            data.allowedEnergyTypes,
                            data.key
                          )}
                        >
                          <span>{data.title}</span>
                          <span className="tooltip-wrapper">
                            <input
                              type="button"
                              onClick={onClickToolTip}
                              className="info-btn"
                              value=""
                            />
                            {isShowToolTip ? (
                              <p className="desc-tooltip--text">
                                <p>
                                  <span className="font-primary-bold">
                                    {data.title}
                                  </span>
                                  {data.hovertext}
                                </p>
                              </p>
                            ) : (
                              ''
                            )}
                          </span>
                          {selectedData['sub-units-data-checked'] &&
                            data.title === selectedData.units &&
                            Object.values(
                              selectedData['sub-units-data-checked']
                            ).length !== 0 && (
                              <span className="counted-units">
                                {
                                  Object.values(
                                    selectedData['sub-units-data-checked']
                                  ).length
                                }
                              </span>
                            )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {selectedStep === 1 ? (
                  <div className="units-selection--items">
                    <div className="units-selection--item has-child selected active">
                      <button
                        type="button"
                        className="info units-selection--link"
                        onClick={handleBack}
                      >
                        {selectedData.units}
                      </button>
                    </div>

                    {dataTypesData.map((data) => {
                      if (data.title === selectedData.units) {
                        return (
                          <div key={data}>
                            {data.sub.map((subdata) => (
                              <div
                                key={subdata.key}
                                className="units-selection--item has-child in-active"
                              >
                                <button
                                  type="button"
                                  className={`units-selection--link  ${
                                    selectedData['sub-units-data-checked'] &&
                                    subdata.title !==
                                      selectedData['sub-units'] &&
                                    Object.values(
                                      selectedData['sub-units-data-checked']
                                    ).length !== 0
                                      ? 'not-selected-blur'
                                      : ''
                                  }`}
                                  onClick={handleSecondClick(
                                    subdata.title,
                                    subdata.key
                                  )}
                                >
                                  {subdata.title}
                                  {selectedData['sub-units-data-checked'] &&
                                  subdata.title === selectedData['sub-units'] &&
                                  Object.values(
                                    selectedData['sub-units-data-checked']
                                  ).length !== 0 ? (
                                    <span className="counted-units">
                                      {
                                        Object.values(
                                          selectedData['sub-units-data-checked']
                                        ).length
                                      }
                                    </span>
                                  ) : (
                                    ''
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return true;
                    })}
                  </div>
                ) : (
                  ''
                )}

                {selectedStep === 2 ? (
                  <div className="units-selection--items">
                    <div className="units-selection--items">
                      <div className="units-selection--item has-child active">
                        <button
                          type="button"
                          className="units-selection--link"
                          onClick={handleBack}
                        >
                          {selectedData['sub-units']}
                        </button>
                      </div>
                    </div>
                    <div className="units-selection--item has-child active">
                      <div className="unit-selection-listing--wrapper">
                        <div className="unit-selection-listing--title">
                          {`${selectedData.units}/${selectedData['sub-units']}`}
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={onTotalClick}
                            checked={
                              selectedData['sub-units-total'] ===
                              `${selectedData['sub-units-key']}_total`
                            }
                            name={`${selectedData['sub-units-key']}_total`}
                            id="KBDProductionTotal"
                          />
                          <label htmlFor className="form-check-label">
                            {selectedData.units}
                            {selectedData['sub-units']}
                            total
                          </label>
                        </div>
                        <div className="row">
                          <div className="col-md-6 col-lg-4">
                            <div className="units-selection--attribute">
                              {/* if any selection selected then add in-active class on siblings */}
                              <ul className="units-selection--attr-lists">
                                {dataTypesData.map((data) => {
                                  if (data.title === selectedData.units) {
                                    return (
                                      <div key={data.key}>
                                        {data.sub.map((subdata) => {
                                          if (
                                            subdata.title ===
                                            selectedData['sub-units']
                                          ) {
                                            return (
                                              <div key={subdata.key}>
                                                {subdata.sub.map((subData) => (
                                                  <div>
                                                    {subData.sub ? (
                                                      <button
                                                        type="button"
                                                        key={subData.key}
                                                        onClick={handleThirdClick(
                                                          subData.title,
                                                          subData.key
                                                        )}
                                                        className="units-selection--attr-list has-child active"
                                                      >
                                                        {subData.title}
                                                      </button>
                                                    ) : (
                                                      <div
                                                        key={subData.key}
                                                        className="form-check"
                                                      >
                                                        {selectedData[
                                                          'sub-units-data-checked'
                                                        ] ? (
                                                          <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name={subData.key}
                                                            defaultChecked={
                                                              selectedData[
                                                                'sub-units-data-checked'
                                                              ][subData.key]
                                                            }
                                                            id="LightDistillatesTotal"
                                                            onChange={handleChange(
                                                              'no_sub'
                                                            )}
                                                          />
                                                        ) : (
                                                          <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name={subData.key}
                                                            id="LightDistillatesTotal"
                                                            onChange={handleChange(
                                                              'no_sub'
                                                            )}
                                                          />
                                                        )}
                                                        <label
                                                          htmlFor
                                                          className="form-check-label"
                                                        >
                                                          {subData.title}
                                                        </label>
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            );
                                          }
                                          return true;
                                        })}
                                      </div>
                                    );
                                  }
                                  return true;
                                })}
                              </ul>
                            </div>
                          </div>
                          {isExpand === true ? (
                            <div className="col-md-6 col-lg-8 child-checkbox--wrapper-box">
                              <div className="child-checkbox--wrapper">
                                {dataTypesData.map((data) => {
                                  if (data.title === selectedData.units) {
                                    return (
                                      <div key={data.key}>
                                        {data.sub.map((subdata) => {
                                          if (
                                            subdata.title ===
                                            selectedData['sub-units']
                                          ) {
                                            return (
                                              <div key={subdata.key}>
                                                {subdata.sub.map((subData) => {
                                                  if (
                                                    selectedData[
                                                      'sub-units-data'
                                                    ] &&
                                                    subData.sub &&
                                                    subData.title ===
                                                      selectedData[
                                                        'sub-units-data'
                                                      ][0]
                                                  ) {
                                                    return (
                                                      <div key={subData.key}>
                                                        <div className="form-check">
                                                          {selectedData[
                                                            'sub-units-data-total'
                                                          ] ? (
                                                            <input
                                                              className="form-check-input"
                                                              onChange={
                                                                onSubUnitsTotalClick
                                                              }
                                                              defaultChecked={
                                                                selectedData[
                                                                  'sub-units-data-total'
                                                                ][
                                                                  `${subData.key}_total`
                                                                ]
                                                              }
                                                              name={`${subData.key}_total`}
                                                              type="checkbox"
                                                            />
                                                          ) : (
                                                            <input
                                                              className="form-check-input"
                                                              onChange={
                                                                onSubUnitsTotalClick
                                                              }
                                                              name={`${subData.key}_total`}
                                                              type="checkbox"
                                                            />
                                                          )}
                                                          <label
                                                            htmlFor
                                                            className="form-check-label"
                                                          >
                                                            {subData.title}
                                                            {'  '}
                                                            total
                                                          </label>
                                                        </div>
                                                        {subData.sub.map(
                                                          (subUnitsdata) => (
                                                            <div
                                                              key={
                                                                subUnitsdata.key
                                                              }
                                                              className="form-check"
                                                            >
                                                              {selectedData[
                                                                'sub-units-data-checked'
                                                              ] ? (
                                                                <input
                                                                  className="form-check-input"
                                                                  type="checkbox"
                                                                  name={
                                                                    subUnitsdata.key
                                                                  }
                                                                  defaultChecked={
                                                                    selectedData[
                                                                      'sub-units-data-checked'
                                                                    ][
                                                                      subUnitsdata
                                                                        .key
                                                                    ]
                                                                  }
                                                                  id="LightDistillatesTotal"
                                                                  onChange={handleChange(
                                                                    ''
                                                                  )}
                                                                />
                                                              ) : (
                                                                <input
                                                                  className="form-check-input"
                                                                  type="checkbox"
                                                                  name={
                                                                    subUnitsdata.key
                                                                  }
                                                                  id="LightDistillatesTotal"
                                                                  onChange={handleChange(
                                                                    ''
                                                                  )}
                                                                />
                                                              )}
                                                              <label
                                                                htmlFor
                                                                className="form-check-label"
                                                              >
                                                                {
                                                                  subUnitsdata.title
                                                                }
                                                              </label>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  }
                                                  return true;
                                                })}
                                              </div>
                                            );
                                          }
                                          return true;
                                        })}
                                      </div>
                                    );
                                  }
                                  return true;
                                })}
                              </div>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

DataTypes.propTypes = {
  dataTypesData: PropTypes.node.isRequired,
  selectedDataTypes: PropTypes.node.isRequired,
};
