import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportingAccesibility from 'highcharts/modules/accessibility';
import { useCookies } from 'react-cookie';
import ExportingData from 'highcharts/modules/export-data';
import React, { useContext, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  UrlNavigation,
  getHighchartsData,
  createContextVariableFromUrl,
  disableChartType,
  chartTypeArr,
} from 'utils';
import ResultTopHeader from './components/resultTopHeader';
import TableRender from './components/tableRender';
import QuickCalculationRender from './components/quickCalculationRender';
import { dashboardData } from '../../data-layer/data-layer';
import { selectedDataContext } from '../../context/selectedData';
import glyphsChevronDown from '../../assets/images/icons/glyphs-chevron-down.svg';
import iconLineChart from '../../assets/images/icons/icons-line-chart.svg';
import iconTable from '../../assets/images/icons/icons-table.svg';
import glyphsDownloadSmall from '../../assets/images/icons/glyphs-download-small.svg';
import popupCloseIcon from '../../assets/images/icons/glyphs-cross.svg';
import expandIcon from '../../assets/images/icons/expand-icon.svg';
import filterUpArrow from '../../assets/images/icons/glyphs-chevron-up-purple.svg';
import BreadCrumbs from '../filter/components/breadcrumbs';
import ErrorBar from '../filter/components/errorbar';
import { featuredReportContext } from '../../context/featuredReport';
import { responsiveDataContext } from '../../context/responsiveContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';

export default function Results() {
  const [responsiveContext] = useContext(responsiveDataContext);
  Exporting(Highcharts);
  ExportingAccesibility(Highcharts);
  ExportingData(Highcharts);
  const location = useLocation();
  const splitUrl = location.pathname.split('results/')[1];
  const [type, setType] = React.useState(
    splitUrl ? splitUrl.split('view/')[1] : ''
  );
  const [isShowSidebar, setisShowSidebar] = React.useState(!responsiveContext);
  const [isShowDropdown, setisShowDropdown] = React.useState(true);
  const [isFromDropdown, setIsFromDropdown] = React.useState(false);
  const [isToDropdown, setIsToDropdown] = React.useState(false);
  const [isShowExportDropdown, setisShowExportDropdown] = React.useState(true);
  const chartComponent = React.useRef(null);
  const isShowDropdownRef = React.useRef();
  const isShowExportDropdownRef = React.useRef();
  const isShowFromDropdownRef = React.useRef();
  const isShowToDropdownRef = React.useRef();
  const navigate = useNavigate();
  const [selectedDataState, setselectedDataState, clearSelectedDataState] =
    useContext(selectedDataContext);
  const [isTableView, setIsTableView] = React.useState(type !== 'table');
  const [highChartsObject, setHighChartsObject] = React.useState({
    chartsData: [],
    tableData: [],
    minMaxData: [],
  });
  const [isShowPopupEnergyPrice, setIsShowPopupEnergyPrice] = useState(false);
  const [isShowPopupNewReport, setIsShowPopupNewReport] = useState(false);
  const [cookies, setCookie] = useCookies(['energyPopup', 'newReportPopup']);
  const [isCheckedDontShowForEnergy, setIsCheckedDontShowForEnergy] =
    React.useState(false);
  const [isCheckedDontShowForNewReport, setIsCheckedDontShowForNewReport] =
    React.useState(false);
  const [isCancelClicked, setIsCancelClicked] = React.useState(false);
  const [isErrorShow, setIsErrorShow] = React.useState(false);

  const [featuredReportState] = useContext(featuredReportContext);
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  const [displayYear, setDisplayYear] = useState({
    from: null,
    to: null,
  });
  const [selectedYear, setSelectedYear] = useState({
    from: null,
    to: null,
  });
  const currCalVal =
    splitUrl && splitUrl.search('calc') !== -1
      ? splitUrl.split('calc/')[1].split('/view')[0].split('/')[0]
      : '';

  const setDataForYearDropdown = (minYear, maxYear, state) => {
    setDisplayYear({
      ...displayYear,
      from: minYear,
      to: maxYear,
    });
    if (selectedYear.from === null || state === false) {
      setSelectedYear({
        ...selectedYear,
        from: minYear,
        to: maxYear,
      });
    }
  };

  React.useEffect(() => {
    if (responsiveContext) {
      setisShowSidebar(false);
    } else {
      setisShowSidebar(true);
    }
  }, [responsiveContext]);

  const setContextData = (state = false) => {
    let selectedYearVal = {
      from: null,
      to: null,
    };
    if (state === true) {
      selectedYearVal = selectedYear;
    }

    if (splitUrl) {
      const typeFromUrl = splitUrl.split('view/')[1];
      setType(typeFromUrl);
      setIsTableView(typeFromUrl !== 'table');
      if (typeFromUrl === 'table') {
        setIsTableView(false);
      }

      if (splitUrl && splitUrl.search('ep/') !== -1) {
        const epValue = splitUrl.split('ep/')[1].split('/')[0];
        const unit = splitUrl.split('unit/')[1].split('/')[0];
        setselectedDataState({
          ...selectedDataState,
          energyPrice: epValue,
          energyPriceUnit: unit,
          quickCalculations: currCalVal,
          dataTypes: {},
        });
        getHighchartsData(
          epValue,
          typeFromUrl,
          splitUrl,
          selectedYearVal,
          currCalVal
        ).then((data) => {
          chartComponent?.current?.chart.xAxis[0].setExtremes();
          setHighChartsObject(data);
          setDataForYearDropdown(
            data.minMaxData.minYear,
            data.minMaxData.maxYear,
            state
          );
        });
      } else if (splitUrl) {
        const contextData = createContextVariableFromUrl(splitUrl);
        if (contextData.location[0] !== '') {
          setselectedDataState({
            ...selectedDataState,
            dataTypes: contextData.dataTypes,
            quickCalculations: currCalVal,
            location: contextData.location,
            energyPrice: '',
            energyPriceUnit: '',
          });
          getHighchartsData(
            contextData,
            typeFromUrl,
            splitUrl,
            selectedYearVal,
            currCalVal
          ).then((data) => {
            chartComponent?.current?.chart.xAxis[0].setExtremes();
            setHighChartsObject(data);
            setDataForYearDropdown(
              data.minMaxData.minYear,
              data.minMaxData.maxYear,
              state
            );
          });
        }
      }
    } else if (!selectedDataState.errorbar) {
      setselectedDataState({
        ...selectedDataState,
        dataTypes: '',
        quickCalculations: '',
        location: [],
        energyPrice: '',
        energyPriceUnit: '',
      });
    }
  };

  const onSubmitClick = () => {
    if (selectedYear.from > selectedYear.to) {
      setIsErrorShow(true);
    } else {
      setIsErrorShow(false);
      chartComponent?.current?.chart.xAxis[0].setExtremes();
      setContextData(true);
    }
  };

  React.useEffect(() => {
    setSelectedYear({
      ...selectedYear,
      from: null,
      to: null,
    });
    setIsErrorShow(false);
    setContextData();
  }, [splitUrl]);

  const displayChartType = () => {
    let chartTypeName = 'Chart type';
    if (type === 'area') chartTypeName = 'Area chart';
    else if (type === 'line') chartTypeName = 'Line chart';
    else if (type === 'bar') chartTypeName = 'Bar chart';
    else if (type === 'column') chartTypeName = 'Stacked chart';
    else chartTypeName = 'Chart type';
    if (type === 'table' && responsiveContext) {
      chartTypeName = 'Table';
    }
    return chartTypeName;
  };

  useEffect(() => {
    chartComponent?.current?.chart?.reflow();
  }, [isShowSidebar]);

  const changeSidebar = () => {
    setisShowSidebar(!isShowSidebar);
  };

  const changeDropdown = () => {
    if (isShowDropdown) setisShowDropdown(false);
    else setisShowDropdown(true);
  };

  const changeExportDropdown = () => {
    if (isShowExportDropdown) setisShowExportDropdown(false);
    else setisShowExportDropdown(true);
  };

  const changeTableView = () => {
    document.getElementById('spinner').style.display = 'block';
    navigate(`${location.pathname.split('/').slice(0, -1).join('/')}/table`);
  };
  const changeChartDropdownValue = (value) => {
    document.getElementById('spinner').style.display = 'block';
    changeDropdown();
    setTimeout(() => {
      navigate(
        `${location.pathname.split('/').slice(0, -1).join('/')}/${value}`
      );
    }, 1);
  };

  const changeExportDropdownValue = (value) => {
    if (value === 'image') {
      chartComponent.current.chart.exportChart();
    } else if (value === 'current_data') {
      chartComponent.current.chart.downloadCSV();
    } else if (value === 'all_data') {
      window.open(dashboardData.downloadfullreport);
    }
    changeExportDropdown();
  };

  const sendDataToParent = (value) => {
    setIsCancelClicked(false);
    if (value.energyPrice) {
      setIsShowPopupEnergyPrice(value.energyPrice);
    }
    if (value.newReport) {
      setIsShowPopupNewReport(value.newReport);
    }
    if (value.navigateUrl) {
      navigate(value.navigateUrl);
    }
  };

  const OnClickContinue = () => {
    const url = UrlNavigation(selectedDataState, splitUrl, 'line');
    navigate(url);
    setIsShowPopupEnergyPrice(false);
    if (isCheckedDontShowForEnergy) {
      setCookie('energyPopup', 'true', { path: '/', expires: expiryDate });
    }
  };

  const onClickEditorNew = (value) => {
    if (isCheckedDontShowForNewReport) {
      setCookie('newReportPopup', 'true', { path: '/', expires: expiryDate });
    }
    if (value === 'new') {
      clearSelectedDataState();
    }
    const url = `/filter`;
    navigate(url);
  };

  const dontShowClick = (state) => {
    setIsCheckedDontShowForEnergy(state);
  };

  const dontShowNewReport = (state) => {
    setIsCheckedDontShowForNewReport(state);
  };

  useOnClickOutside(isShowDropdownRef, () => setisShowDropdown(true));
  useOnClickOutside(isShowFromDropdownRef, () => setIsFromDropdown(false));
  useOnClickOutside(isShowExportDropdownRef, () =>
    setisShowExportDropdown(true)
  );
  useOnClickOutside(isShowToDropdownRef, () => setIsToDropdown(false));

  const onClickNewReport = () => {
    if (cookies.newReportPopup === 'true') {
      clearSelectedDataState();
      const url = `/filter`;
      navigate(url);
      setisShowDropdown(false);
    } else {
      setIsShowPopupNewReport(true);
    }
  };

  const changeFromDropdown = () => {
    setIsFromDropdown(!isFromDropdown);
  };

  const changeToDropdown = () => {
    setIsToDropdown(!isToDropdown);
  };

  const notificationCount = () => {
    let count = [];
    if (selectedDataState?.dataTypes?.energy) {
      selectedDataState.dataTypes.energy.forEach((element) => {
        count.push(element.key);
        element.types.forEach((element2) => {
          count.push(element2.key);
        });
      });
    }
    count = [...new Set(count)].length;
    if (selectedDataState.location) {
      count += selectedDataState.location.length;
    }
    return count;
  };

  const setYearData = (dropdownType, year) => {
    if (dropdownType === 'from') {
      setIsFromDropdown(false);
      setSelectedYear({
        ...selectedYear,
        from: year,
      });
    } else {
      setIsToDropdown(false);
      setSelectedYear({
        ...selectedYear,
        to: year,
      });
    }
  };

  const createSelectItems = (dropdownType) => {
    const items = [];
    for (let i = Number(displayYear.from); i <= Number(displayYear.to); i++) {
      items.push(
        <li>
          <button type="button" onClick={() => setYearData(dropdownType, i)}>
            {i}
          </button>
        </li>
      );
    }
    return items;
  };

  return (
    <main
      className={`main ${
        featuredReportState || isShowPopupEnergyPrice || isShowPopupNewReport
          ? 'popup-open'
          : ''
      }`}
    >
      {/* add class popup-open when popup open */}
      {(isShowPopupNewReport || isShowPopupEnergyPrice) && (
        <div className="popup-overlay" />
      )}

      <section className="section--wrapper">
        <div className="container">
          <ErrorBar />
          {isShowPopupEnergyPrice && (
            <div className="popupmodal">
              <div className="popupContent">
                <div className="close-step-form--wrapper">
                  <button
                    type="button"
                    className="close--steps"
                    onClick={() => {
                      setIsShowPopupEnergyPrice(false);
                    }}
                  >
                    <img src={popupCloseIcon} alt="" className="closeicon" />
                  </button>
                </div>
                <h4>Energy prices</h4>
                <p>
                  Are you sure you want to clear all data and view the energy
                  prices report?
                </p>
                <ul className="popupbtns">
                  <li>
                    <button
                      type="button"
                      name=""
                      className="button--primary alert-btn"
                      onClick={OnClickContinue}
                    >
                      Continue
                    </button>
                  </li>
                </ul>
                <div className="showagain">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="dontshowagain"
                    checked={isCheckedDontShowForEnergy}
                    onChange={(event) => {
                      dontShowClick(event.target.checked);
                    }}
                  />
                  <p className="form-check-label">Don’t show this again</p>
                </div>
              </div>
            </div>
          )}

          {isShowPopupNewReport && (
            <div className="popupmodal">
              <div className="popupContent">
                <div className="close-step-form--wrapper">
                  <button
                    type="button"
                    className="close--steps"
                    onClick={() => {
                      setIsShowPopupNewReport(false);
                    }}
                  >
                    <img src={popupCloseIcon} alt="" className="closeicon" />
                  </button>
                </div>
                <h4>New report</h4>
                <p>
                  Are you sure you want to clear all data and create a new
                  report?
                </p>
                <ul className="popupbtns">
                  {splitUrl && splitUrl.search('ep/') !== 0 && (
                    <li>
                      <button
                        type="button"
                        name=""
                        className="button--outline alert-btn"
                        onClick={() => onClickEditorNew('edit')}
                      >
                        Edit report
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      name=""
                      className="button--primary alert-btn"
                      onClick={() => onClickEditorNew('new')}
                    >
                      Create new report
                    </button>
                  </li>
                </ul>
                <div className="showagain">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="dontshowagainnewReport"
                    checked={isCheckedDontShowForNewReport}
                    onChange={(event) => {
                      dontShowNewReport(event.target.checked);
                    }}
                  />
                  <p className="form-check-label">Don’t show this again</p>
                </div>
              </div>
            </div>
          )}

          <ResultTopHeader
            energyPopupShow={isShowPopupEnergyPrice}
            newReportPopupShow={isShowPopupNewReport}
            cancelClicked={isCancelClicked}
            sendDataToParent={sendDataToParent}
          />
          <div className="chart-wrapper">
            <div
              className={`chart-body-part  ${
                !isShowSidebar ? 'char-body-closed-sidebar' : ''
              }`}
            >
              {/* added char-body-closed-sidebar class for chart-body style */}
              {!splitUrl ? (
                <div className="nodata-block">
                  <div className="nodate-container">
                    <h3>No data selected</h3>
                    <div className="nodata-options row">
                      <div className="col-6">
                        <div className="no-option left-nooption">
                          <p className="">Start a new report</p>
                          <input
                            type="button"
                            className="report-btn new-report-btn button--primary"
                            value="New report"
                            onClick={onClickNewReport}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="no-option">
                          <p className="">
                            Use filters on
                            <br />
                            the right
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chart-loader-parent">
                  <div ref={isShowDropdownRef} className="chart-control-panel">
                    {splitUrl && (
                      <ul className="line-chart-selection">
                        <li
                          className={`selectbox  ${
                            !isShowDropdown ? 'open-state' : ''
                          }`}
                        >
                          {/* open-state used for box-shadow when open dropdown */}
                          <button
                            type="button"
                            onClick={changeDropdown}
                            className={`selectbtnchart  ${
                              type !== 'table' && 'activeBtn'
                            }`}
                          >
                            {/* Add Class activeBtn for active state */}
                            <span className="link-icon">
                              <img src={iconLineChart} alt="" />
                            </span>
                            <span className="link-text">
                              {displayChartType()}
                            </span>
                            <span className="arrow-icon">
                              <img src={glyphsChevronDown} alt="" />
                            </span>
                          </button>
                          <CSSTransition
                            in={!isShowDropdown}
                            timeout={300}
                            classNames="dropdownSlide"
                            unmountOnExit
                          >
                            <ul>
                              {Object.keys(chartTypeArr[0]).map(
                                (value, index) => {
                                  if (
                                    value === 'table' &&
                                    responsiveContext === false
                                  ) {
                                    return true;
                                  }
                                  return (
                                    <li key={index}>
                                      <button
                                        type="button"
                                        disabled={disableChartType(
                                          value,
                                          currCalVal
                                        )}
                                        onClick={() =>
                                          changeChartDropdownValue(value)
                                        }
                                        name={value}
                                      >
                                        {chartTypeArr[0][value]}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </CSSTransition>
                        </li>
                        <li className="table-select-button">
                          <button
                            type="button"
                            disabled={isTableView !== true}
                            onClick={changeTableView}
                            className={`selectbtnchart  ${
                              type === 'table' && 'activeBtn'
                            }`}
                          >
                            <span className="link-icon">
                              <img src={iconTable} alt="" />
                            </span>
                            <span className="link-text"> Table </span>
                          </button>
                        </li>
                        <li
                          ref={isShowExportDropdownRef}
                          className={`selectbox right-aligned-selectbox  ${
                            !isShowExportDropdown ? 'open-state' : ''
                          }`}
                        >
                          {/* open-state used for box-shadow when open dropdown */}
                          <button
                            type="button"
                            onClick={changeExportDropdown}
                            className="selectbtnchart"
                          >
                            <span className="link-icon">
                              <img src={glyphsDownloadSmall} alt="" />
                            </span>
                            <span className="link-text"> Export data </span>
                            <span className="arrow-icon">
                              <img src={glyphsChevronDown} alt="" />
                            </span>
                          </button>
                          <CSSTransition
                            in={!isShowExportDropdown}
                            timeout={300}
                            classNames="dropdownSlide"
                            unmountOnExit
                          >
                            <ul>
                              <li className="mobile_hide">
                                <button
                                  type="button"
                                  disabled={type === 'table'}
                                  onClick={() =>
                                    changeExportDropdownValue('image')
                                  }
                                >
                                  Graph (.png)
                                </button>
                              </li>
                              <li className="mobile_hide">
                                <button
                                  type="button"
                                  disabled={type === 'table'}
                                  onClick={() => {
                                    changeExportDropdownValue('current_data');
                                  }}
                                >
                                  Current data (.csv)
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => {
                                    changeExportDropdownValue('all_data');
                                  }}
                                >
                                  All data (.xlsx)
                                </button>
                              </li>
                            </ul>
                          </CSSTransition>
                        </li>
                        {responsiveContext ? (
                          <li className="expand-btn">
                            <button
                              type="button"
                              className="expand-btn selectbtnchart"
                            >
                              <span>
                                <img src={expandIcon} alt="expand icon" />
                              </span>
                            </button>
                          </li>
                        ) : (
                          <></>
                        )}
                      </ul>
                    )}
                  </div>
                  <div className="chartheight">
                    <div id="spinner" className="highchart-loader">
                      <div className="loader">
                        <div className="sppiner_wraper">
                          <p>Loading</p>
                          <div class="spinnerdot">
                            <div class="bounce1"></div>
                            <div class="bounce2"></div>
                            <div class="bounce3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isTableView && highChartsObject?.chartsData?.series ? (
                      <div className="chart_page">
                        <HighchartsReact
                          ref={chartComponent}
                          highcharts={Highcharts}
                          constructorType="stockChart"
                          options={highChartsObject.chartsData}
                        />
                      </div>
                    ) : (
                      <>
                        {highChartsObject.tableData.length !== 0 && (
                          <TableRender data={highChartsObject.tableData} />
                        )}
                      </>
                    )}
                  </div>
                  <div className="year-form-parent">
                    <div className="year-form">
                      <label>From</label>
                      <div
                        ref={isShowFromDropdownRef}
                        className="year-selection"
                      >
                        <button
                          type="button"
                          onClick={changeFromDropdown}
                          className="selectbtnchart"
                        >
                          <span className="link-text">{selectedYear.from}</span>
                        </button>
                        <ul
                          className={` ${isFromDropdown ? 'openFromUl' : ''}`}
                        >
                          {createSelectItems('from')}
                        </ul>
                      </div>
                    </div>
                    <div className="year-form">
                      <label>To</label>
                      <div ref={isShowToDropdownRef} className="year-selection">
                        <button
                          type="button"
                          onClick={changeToDropdown}
                          className="selectbtnchart"
                        >
                          <span className="link-text"> {selectedYear.to} </span>
                        </button>
                        <ul className={`${isToDropdown ? 'openToUl' : ''}`}>
                          {createSelectItems('to')}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={onSubmitClick}
                        className="year-btn"
                      />
                    </div>
                  </div>
                  {isErrorShow && (
                    <div className="errorbox">
                      "From" value should not be greater than "to" value
                    </div>
                  )}
                </div>
              )}
              {isTableView && (
                <QuickCalculationRender currCalVal={currCalVal} />
              )}
            </div>

            <div
              className={`sidebar  ${!isShowSidebar ? 'closed-sidebar' : ''}`}
            >
              {/* added closed-sidebar class for closed sidebar style */}
              <div className="left-side-sidebar">
                <div className="sidebar-access-panel">
                  {responsiveContext ? (
                    <button
                      type="button"
                      onClick={changeSidebar}
                      aria-label="button"
                      className="sidebar-access-btn filtercountbtn"
                    >
                      {splitUrl && splitUrl.search('ep/') === -1 ? (
                        <div>{`${notificationCount()} filters applied`}</div>
                      ) : (
                        'View Filter'
                      )}

                      <div>
                        <img src={filterUpArrow} alt="" />
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={changeSidebar}
                      aria-label="button"
                      className="sidebar-access-btn"
                    >
                      {splitUrl && splitUrl.search('ep/') === -1 && (
                        <span>{notificationCount()}</span>
                      )}
                    </button>
                  )}
                </div>
                <div className="sidebreadcrums">
                  {splitUrl && splitUrl.search('ep/') !== -1 ? (
                    <div className="more-options generatenewreport">
                      <div className="generateReportDiv">
                        <h4>
                          Advanced filter options are disabled based on your
                          current report selections
                        </h4>
                        <p>
                          Click the create a new report button to build a new
                          chart using the advanced filter options
                        </p>
                        <input
                          type="button"
                          className="report-btn new-report-btn button--primary"
                          value="New report"
                          onClick={onClickNewReport}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="side-filters">
                        <div className="filter-heading">
                          <h3>Filter</h3>
                          <p>Customise your current report </p>
                        </div>
                      </div>
                      <BreadCrumbs onResultPage={true} />
                      <div className="more-options">
                        <p>Want more options?</p>
                        <Link
                          to="/filter"
                          className="report-btn button--primary"
                          title="Edit report"
                        >
                          Edit report
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
