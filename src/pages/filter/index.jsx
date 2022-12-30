import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { selectedDataContext } from '../../context/selectedData';
import Footer from './components/footer';
import Header from './components/header';
import ResultTopHeader from '../results/components/resultTopHeader';
import popupCloseIcon from '../../assets/images/icons/glyphs-cross.svg';
import { responsiveDataContext } from '../../context/responsiveContext';
import ErrorBar from './components/errorbar';

export default function Filter() {
  const navigate = useNavigate();
  const [isShowPopupEnergyPrice, setIsShowPopupEnergyPrice] = useState(false);
  const [isShowPopupNewReport, setIsShowPopupNewReport] = useState(false);
  const [isCancelClicked, setIsCancelClicked] = React.useState(false);

  const [, setCookie] = useCookies(['energyPopup', 'newReportPopup']);
  const [energyData, setEnergyData] = React.useState([]);

  const [responsiveContext] = useContext(responsiveDataContext);

  const [selectedDataState, , clearSelectedDataState] =
    useContext(selectedDataContext);

  const [isCheckedDontShowForEnergy, setIsCheckedDontShowForEnergy] =
    React.useState(false);
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  const sendDataToParent = (value) => {
    setIsCancelClicked(false);
    if (value.energyPrice) {
      setIsShowPopupEnergyPrice(value.energyPrice);
      if (value.data) {
        setEnergyData(value.data);
      }
    }
    if (value.newReport) {
      setIsShowPopupNewReport(value.newReport);
    }
    if (value.navigateUrl) {
      navigate(value.navigateUrl);
    }
  };

  React.useEffect(() => {}, [selectedDataState]);

  function clearAll() {
    clearSelectedDataState();
  }

  const OnClickContinue = () => {
    clearAll();
    setIsShowPopupEnergyPrice(false);
    if (isCheckedDontShowForEnergy) {
      setCookie('energyPopup', 'true', { path: '/', expires: expiryDate });
    }
    const url = `/results/ep/${energyData.key}/unit/${energyData.unit}/view/line`;
    navigate(url);
  };

  const onCancelClick = () => {
    setIsCancelClicked(true);
    setIsShowPopupEnergyPrice(false);
  };

  const dontShowClick = (state) => {
    setIsCheckedDontShowForEnergy(state);
  };

  return (
    <>
      <main className={`main ${isShowPopupEnergyPrice ? 'popup-open' : ''}`}>
        {isShowPopupEnergyPrice && <div className="popup-overlay" />}

        <section className="section--wrapper">
          <div className="container">
            <div className="main-frame">
              <ErrorBar />
              <div className="row">
                <div className="col-1 offset-11">
                  <div className="close-step-form--wrapper">
                    <Link
                      to="/"
                      className="close--steps"
                      onClick={() => {
                        clearSelectedDataState();
                      }}
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
              {isShowPopupEnergyPrice && (
                <div className="popupmodal">
                  <div className="close-step-form--wrapper">
                    {/* <button
                  type="button"
                  className="close--steps"
                  onClick={() => {
                    setIsShowPopupEnergyPrice(false);
                  }}
                >
                  Cancel
                </button> */}
                  </div>
                  <div className="popupContent">
                    <div className="close-step-form--wrapper">
                      <button
                        type="button"
                        className="close--steps"
                        onClick={onCancelClick}
                      >
                        <img
                          src={popupCloseIcon}
                          alt=""
                          className="closeicon"
                        />
                      </button>
                    </div>
                    <h4>Energy prices</h4>
                    <p>
                      Are you sure you want to clear all data and view the
                      energy prices report?
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
              <div className="filterpageHeader row">
                <div className="col-lg-12 col-md-12">
                  <ResultTopHeader
                    energyPopupShow={isShowPopupEnergyPrice}
                    newReportPopupShow={isShowPopupNewReport}
                    cancelClicked={isCancelClicked}
                    sendDataToParent={sendDataToParent}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="stepwizard--wrapper">
                    <div className="steps-title">
                      <h4>
                        Select the energy type(s) and location(s) you wish to
                        view data on
                      </h4>
                    </div>
                    <Header />
                    {responsiveContext ? <></> : <Footer />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
