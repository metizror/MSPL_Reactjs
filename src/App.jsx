import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { CSSTransition } from 'react-transition-group';

import '../node_modules/bootstrap/dist/css/bootstrap-reboot.css';
import '../node_modules/bootstrap/dist/css/bootstrap-grid.css';
import '../node_modules/bootstrap/dist/css/bootstrap-utilities.css';
import './App.scss';
import { responsiveDataContext } from './context/responsiveContext';
import { featuredReportContext } from './context/featuredReport';

const DashBoard = React.lazy(() => import('./pages/dashboard'));
const Results = React.lazy(() => import('./pages/results'));
const Filter = React.lazy(() => import('./pages/filter'));
const ViewAllReports = React.lazy(() => import('./pages/view_all_reports'));

function App() {
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
  const [fullscreen, setfullscreen] = React.useState(false);
  const [featuredReportState] = useContext(featuredReportContext);
  const [, setResponsiveContext] = useContext(responsiveDataContext);
  useEffect(() => {
    setResponsiveContext(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (window.screen.width <= 768) {
      setResponsiveContext(true);
    } else {
      setResponsiveContext(false);
    }
  }, [window.screen.width]);
  function detectWindowSize() {
    if (window.innerWidth <= 768) {
      setResponsiveContext(true);
    } else {
      setResponsiveContext(false);
    }
  }

  window.onresize = detectWindowSize;
  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setfullscreen(false);
    }
  }

  if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
  }

  return (
    <div
      id="fullscreen"
      className={`appwrapper  ${fullscreen === true ? 'fullscreenClass' : ''}`}
    >
      <div className="full-screen--wrapper container">
        {fullscreen === false ? (
          <button
            onClick={() => {
              if (document.querySelector('#fullscreen').requestFullscreen)
                document.querySelector('#fullscreen').requestFullscreen();
              else if (
                document.querySelector('#fullscreen').webkitRequestFullscreen
              )
                document.querySelector('#fullscreen').webkitRequestFullscreen();
              setfullscreen(true);
            }}
            type="button"
            className="full-screen-link"
            id="fullScreenWindow"
          >
            Open in full screen
          </button>
        ) : (
          <button
            onClick={() => {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
              } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              } else if (document.cancelFullScreen) {
                document.cancelFullScreen();
              }
              setfullscreen(false);
            }}
            type="button"
            className="full-screen-link exitfullscreen"
            id="fullScreenWindow"
          >
            Exit full screen
          </button>
        )}
      </div>
      <React.Suspense fallback={<div />}>
        {featuredReportState && (
          <>
            <div className="popup-overlay" />
            <CSSTransition in timeout={30000} classNames="alert">
              <ViewAllReports />
            </CSSTransition>
          </>
        )}
        <Routes>
          <Route path="/results/*" element={<Results />} />
          <Route exact path="/filter" element={<Filter />} />
          <Route exact path="/" element={<DashBoard />} />
        </Routes>
      </React.Suspense>
    </div>
  );
}

export default App;
