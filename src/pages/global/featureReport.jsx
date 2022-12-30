import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { featuredReportContext } from '../../context/featuredReport';
import { selectedDataContext } from '../../context/selectedData';

export default function FeatureReport({
  Key,
  Title,
  Icon,
  Datatype,
  Unit,
  URL,
}) {
  const [, , clearSelectedDataState] = useContext(selectedDataContext);
  const [, setFeaturedReportState] = useContext(featuredReportContext);

  const onClickFeatureReport = (URL) => {
    clearSelectedDataState();
    setFeaturedReportState(false);
  };
  return (
    <Link
      onClick={() => {
        onClickFeatureReport(URL);
      }}
      key={Key}
      to={URL}
    >
      <div className="splash--wrapper">
        <div className="featured-report-box" key={Title + Unit}>
          <div className="splash-fuel-type--wrapper">
            <div className="splash-fuel-type">
              <div className="report-slide-text">
                <img src={Icon} alt={Title} />
                {Title}
              </div>
              <div className="report-detail--wrapp">
                <span className="report-year">{Datatype}</span>
                <span className="report-mtoe">{Unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
