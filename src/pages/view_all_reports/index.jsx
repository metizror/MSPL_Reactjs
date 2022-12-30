import React, { useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { featuredReportContext } from 'context';
import fearturedReports from '../../data/reports.json';
import FeatureReport from '../global/featureReport';

export default function ViewAllReports() {
  const [featuredReportState, setfeaturedReportState] = useContext(
    featuredReportContext
  );
  return (
    <>
      <CSSTransition
        in={featuredReportState}
        timeout={300}
        classNames="fetRepAnim"
        unmountOnExit
      >
        <div>
          <div className="featuredreportmain all-reports-page">
            <div className="featuredReportPopup">
              <div className="close-step-form--wrapper">
                <button
                  type="button"
                  className="close--steps"
                  onClick={() => setfeaturedReportState(false)}
                >
                  Cancel
                </button>
              </div>
              <main className="main main-white-bg">
                <section className="section--wrapper ">
                  <div className="featured-main">
                    <div className="ftr-title">
                      <h3>Featured reports</h3>
                    </div>
                    <div className="featured-row">
                      {fearturedReports.map((report) => (
                        <FeatureReport key={report.Key} {...report} />
                      ))}
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}
