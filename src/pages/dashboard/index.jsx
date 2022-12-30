import React, { useState, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import dashboardData from '../../data/dashboard.json';
import green from '../../assets/images/icons/download-green.svg';
import { selectedDataContext } from '../../context/selectedData';
import { featuredReportContext } from '../../context/featuredReport';
import FeaturedReportsSlider from './components/featuredReportsSlider';
import { responsiveDataContext } from '../../context/responsiveContext';

function DashBoard() {
  const [tabs, setTabs] = useState(true);
  const navigate = useNavigate();
  const [selectedDataState, setselectedDataState, clearSelectedDataState] =
    useContext(selectedDataContext);
  const [featuredReportState] = useContext(featuredReportContext);
  const [responsiveContext] = useContext(responsiveDataContext);
  const slick = useState();

  const onClickEnergyPrice = (data) => {
    const url = `/results/ep/${data.key}/unit/${data.unit}/view/line`;
    navigate(url);
  };
  const onClickEnergyIndicators = (data, keyTitleData) => {
    const Arr = [
      {
        key: keyTitleData.key,
        types: [
          {
            key: data.key,
            title: data.title,
            sub: [{ key: keyTitleData.key, title: keyTitleData.title }],
          },
        ],
      },
    ];
    setselectedDataState({
      ...selectedDataState,
      dataTypes: { units: data.unit, energy: Arr },
      currentEnergyType: keyTitleData.key,
    });
    navigate('/filter');
  };

  function OnClickNewReport() {
    clearSelectedDataState();
    navigate('/filter');
  }

  function onClickEnergyIcon(energy) {
    setselectedDataState({
      ...selectedDataState,
      currentEnergyType: energy,
      energyTypes: [],
      dataTypes: {},
      quickCalculations: '',
      errorbar: false,
      lastRemovedItem: [],
      location: [],
    });
    navigate('/filter');
  }

  const renderHeaderSection = () => (
    <div className="splash-content--wrapper top-content--wrapper">
      <h1 className="heading text-size-h1 text-center">Chart Demo app </h1>
      <p className="text body-intro-text text-center mb-0">
        This app allows you to interrogate data, create
        charts and download reports from the Statistical Review of World Energy
      </p>
      <div className=" energy-types-list">
        {responsiveContext ? (
          <div className="energyTypeSlider">
            <Slider
              ref={slick}
              infinite={false}
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
              arrows={false}
              responsive={[
                {
                  breakpoint: 768,
                  settings: {
                    slidesToScroll: 3,
                    infinite: true,
                  },
                },
              ]}
            >
              {dashboardData.EnergyTypes.map((energytype) => (
                <div className="energyTypeBlock" key={energytype.title}>
                  <button
                    type="button"
                    onClick={() => {
                      onClickEnergyIcon(energytype.name);
                    }}
                  >
                    <img src={energytype.icon} alt={energytype.title} />
                    {energytype.title}
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <ul className=" energy-type-ul">
            {dashboardData.EnergyTypes.map((energytype) => (
              <li key={energytype.title}>
                <button
                  type="button"
                  onClick={() => {
                    onClickEnergyIcon(energytype.name);
                  }}
                >
                  <img src={energytype.icon} alt={energytype.title} />
                  {energytype.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderEnergyPriceSection = () => (
    <div>
      <div className="splash-custom-report--wrapper text-center">
        <p>
          Get started by selecting an energy above
          <br />
          <span> or</span>
        </p>
        <button
          to="/filter"
          type="button"
          onClick={OnClickNewReport}
          className="button--primary customise-report"
          title="Customise Report"
        >
          Create your own report
        </button>
      </div>
      <div className="splash-tabs--wrapper splash-content--wrapper tab--wrapper">
        <div className="nav nav-tabs" id="tab" role="tablist">
          <button
            type="button"
            className={`tab-link  ${tabs ? 'active' : ''}`}
            onClick={() => setTabs(true)}
            id="energy-prices-tab"
            role="tab"
            aria-controls="energy-prices"
            aria-selected={tabs}
          >
            Energy prices
          </button>
          <button
            type="button"
            className={`tab-link  ${tabs ? '' : 'active'}`}
            onClick={() => setTabs(false)}
            id="energy-indicators-tab"
            role="tab"
            aria-controls="energy-indicators"
            aria-selected={!tabs}
          >
            Energy indicators
          </button>
        </div>
        <div className="tab-content" id="nav-tabContent">
          {tabs ? (
            <div
              className="tab-pane fade show active"
              id="energy-prices"
              role="tabpanel"
              aria-labelledby="energy-prices-tab"
            >
              <div className="tab-btn--wrapper">
                <div className="ep_ul">
                  {dashboardData.energyPrices.map((energyPriceData) => (
                    <div className="ep_li" key={energyPriceData.key}>
                      <button
                        type="button"
                        onClick={() => {
                          onClickEnergyPrice(energyPriceData);
                        }}
                        className="button--outline"
                      >
                        {energyPriceData.title}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="tab-pane fade show active"
              id="energy-indicators"
              role="tabpanel"
              aria-labelledby="energy-indicators-tab"
            >
              <div className="tab-btn--wrapper">
                <div className="ep_ul">
                  {dashboardData.energyIndicators.sub.map(
                    (energyIndicatorsData) => (
                      <div className="ep_li" key={energyIndicatorsData.key}>
                        <button
                          type="button"
                          onClick={() => {
                            onClickEnergyIndicators(
                              energyIndicatorsData,
                              dashboardData.energyIndicators
                            );
                          }}
                          className="button--outline"
                        >
                          {energyIndicatorsData.title}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFeatureReportSection = () => (
    <div>
      <div className="download-report--wrapper mt-30 mb-25">
        <p className="text-center">
          Access the whole data and have the flexibility to use your own tools
          <a
            href={dashboardData.downloadfullreport}
            className="download-report"
          >
            Download full report
            <img src={green} alt="Download" />
          </a>
        </p>
      </div>
      <FeaturedReportsSlider reports={dashboardData.featuredReports} />
    </div>
  );

  return (
    <>
      <main className={`main  ${featuredReportState ? 'popup-open' : ''}`}>
        <section className="section--wrapper">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="splash--wrapper">
                  {renderHeaderSection()}
                  {renderEnergyPriceSection()}
                </div>
                {renderFeatureReportSection()}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default DashBoard;
