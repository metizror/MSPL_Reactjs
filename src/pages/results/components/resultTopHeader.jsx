import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  responsiveDataContext,
  selectedDataContext,
  featuredReportContext,
} from 'context';
import { CSSTransition } from 'react-transition-group';
import iconReportBlack from '../../../assets/images/icons/icons-reports-black.svg';
import { dashboardData } from '../../../data-layer/data-layer';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

export default function ResultTopHeader({
  energyPopupShow,
  newReportPopupShow,
  cancelClicked,
  sendDataToParent,
}) {
  const [responsiveContext] = useContext(responsiveDataContext);
  const location = useLocation();
  const [selectedDataState, setselectedDataState, clearSelectedDataState] =
    useContext(selectedDataContext);
  const isShowDropdownRef = React.useRef();
  const [featuredReportState, setfeaturedReportState] = useContext(
    featuredReportContext
  );
  const navigate = useNavigate();
  const [isShowDropdown, setisShowDropdown] = React.useState(false);
  const [energyValue, setEnergyValue] = React.useState(
    location.pathname.search('/ep/') !== -1
      ? location.pathname.split('ep/')[1].split('/')[0]
      : ''
  );
  const energyVal =
    location.pathname.search('/ep/') !== -1
      ? location.pathname.split('ep/')[1].split('/')[0]
      : '';
  const [cookies] = useCookies(['energyPopup', 'newReportPopup']);
  const [isClcikedOnSubmit, setIsClickedOnSubmit] = React.useState(false);

  const changeDropdown = () => {
    if (isShowDropdown) setisShowDropdown(false);
    else setisShowDropdown(true);
  };

  const onEnergyChanged = (index) => {
    setEnergyValue(index);
  };

  React.useEffect(() => {
    if (energyPopupShow === false && isClcikedOnSubmit === true) {
      setisShowDropdown(false);
      const data = dashboardData.energyPrices.filter(
        (x) => x.key === energyValue
      );
      if (data && data.length > 0 && !cancelClicked) {
        setselectedDataState({
          ...selectedDataState,
          energyPrice: data[0].key,
          energyPriceUnit: data[0].unit,
          quickCalculations: '',
          dataTypes: {},
        });
      }
      setIsClickedOnSubmit(false);
    }
  }, [energyPopupShow, newReportPopupShow]);

  const onSubmit = () => {
    const data = dashboardData.energyPrices.filter(
      (x) => x.key === energyValue
    );
    setselectedDataState({
      ...selectedDataState,
      energyPrice: data[0].key,
      energyPriceUnit: data[0].unit,
      quickCalculations: '',
      dataTypes: {},
    });
    if (cookies.energyPopup === 'true') {
      setisShowDropdown(false);
      const url = `/results/ep/${data[0].key}/unit/${data[0].unit}/view/line`;
      navigate(url);
    } else {
      if (window.location.href.search('/filter') !== -1) {
        sendDataToParent({ energyPrice: true, data: data[0] });
      } else {
        sendDataToParent({ energyPrice: true });
      }
      setIsClickedOnSubmit(true);
    }
  };

  useOnClickOutside(isShowDropdownRef, () => setisShowDropdown(false));

  const onClickNewReport = () => {
    if (window.location.href.search('filter') !== -1) {
      clearSelectedDataState();
    } else if (cookies.newReportPopup === 'true') {
      clearSelectedDataState();
      const url = `/filter`;
      navigate(url);
      setisShowDropdown(false);
    } else {
      sendDataToParent({ newReport: true });
      setIsClickedOnSubmit(true);
    }
  };

  return (
    <div className="featuredreportmain">
      {/* <div className="openinfullwidth">
        <button type="button" className="fullScreenBtn">
          <span>Open in full width</span>
          <span>
            <img src={openFullscreen} alt="" />
          </span>
        </button>
      </div> */}
      <div className="top-fixed-header">
        <div className="">
          <div className="">
            <ul>
              <li>
                {responsiveContext ? (
                  <input
                    type="button"
                    className="report-btn button--primary"
                    value="New"
                    onClick={onClickNewReport}
                  />
                ) : (
                  <input
                    type="button"
                    className="report-btn button--primary"
                    value="New report"
                    onClick={onClickNewReport}
                  />
                )}
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setfeaturedReportState(true)}
                  className="button--default featured-button"
                >
                  <span>Featured reports</span>
                  <span>
                    <img src={iconReportBlack} alt="" />
                  </span>
                </button>
              </li>
              <li
                ref={isShowDropdownRef}
                className={`selectbox ${
                  featuredReportState === true && 'open-state'
                }`}
              >
                <div
                  className={`side-socioeconomic  ${
                    isShowDropdown === true ? 'open-state' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={changeDropdown}
                    className="selectbtn"
                  >
                    <span className="link-text">
                      {energyVal !== ''
                        ? dashboardData.energyPrices.filter(
                            (x) => x.key === energyVal
                          )[0].title
                        : 'Energy prices'}
                    </span>
                  </button>
                  <CSSTransition
                    in={isShowDropdown}
                    timeout={800}
                    classNames="dropdownSlide"
                    unmountOnExit
                    // onEnter={() => setisShowDropdown(true)}
                    // onExited={() => setisShowDropdown(false)}
                  >
                    <ul>
                      {dashboardData.energyPrices.map(
                        (energyPriceData, index) => (
                          <li key={index}>
                            {/* checked-li class for checked radio button */}
                            <label>
                              <input
                                type="radio"
                                value={energyValue}
                                defaultChecked={
                                  energyVal === energyPriceData.key
                                }
                                name="energyprices"
                                onClick={() =>
                                  onEnergyChanged(energyPriceData.key)
                                }
                              />
                              {energyPriceData.title}
                            </label>
                          </li>
                        )
                      )}
                      <li className="actionpart">
                        <span>
                          <button
                            type="button"
                            name=""
                            disabled={energyValue === ''}
                            onClick={onSubmit}
                            className="button--primary alert-btn"
                          >
                            Submit
                          </button>
                        </span>
                      </li>
                    </ul>
                    {/* {isShowDropdown === true && (

                    )} */}
                  </CSSTransition>
                </div>
              </li>
              {/* add open-state class to this li for open dropdown */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
ResultTopHeader.propTypes = {
  energyPopupShow: PropTypes.node.isRequired,
  newReportPopupShow: PropTypes.node.isRequired,
  cancelClicked: PropTypes.node.isRequired,
  sendDataToParent: PropTypes.node,
};
