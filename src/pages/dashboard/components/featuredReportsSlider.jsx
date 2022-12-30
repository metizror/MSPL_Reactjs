import React, { useRef, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { featuredReportContext } from '../../../context/featuredReport';
import FeatureReport from '../../global/featureReport';

export default function FeaturedReportsSlider(props) {
  const { reports = [] } = props;
  const pagination = useRef();
  const slick = useRef();
  const [, setfeaturedReportState] = useContext(featuredReportContext);
  return (
    <div className="row dash-featured">
      <div className="col-md-3">
        <div className="featured-report--title">
          <h4 className="text-size-h4 heading text-left">Featured reports</h4>
        </div>
        <div className="featured-btn-part">
          <button
            type="button"
            className="button--outline"
            onClick={() => setfeaturedReportState(true)}
          >
            <span>View all reports</span>
          </button>
        </div>
      </div>
      <div className="col-md-9">
        <div className="featued-report--wrapper">
          <div className="featured-report-slider--wrapper">
            <div className="slider featured-report--slider">
              <Slider
                ref={slick}
                speed={500}
                slidesToShow={3}
                slidesToScroll={2}
                afterChange={function (index) {
                  pagination.current.innerHTML = `${index + 1} / ${
                    slick.current.props.children.length
                  }`;
                }}
                responsive={[
                  {
                    breakpoint: 991,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                    },
                  },
                ]}
              >
                {reports.map((report) => (
                  <FeatureReport key={report.Key} {...report} />
                ))}
              </Slider>
              <div className="slidenumbers" ref={pagination}>
                {`1/${reports.length}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
