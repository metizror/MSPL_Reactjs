import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UrlNavigation } from 'utils';
import { selectedDataContext } from '../../../context/selectedData';
import glyphsInputCheckBoxUnavailable from '../../../assets/images/icons/glyphs-input-check-box-unavailable.svg';
import glyphsInputCheckBoxDefault from '../../../assets/images/icons/glyphs-input-check-box-default.svg';
import glyphsInputCheckBoxInactive from '../../../assets/images/icons/glyphs-input-check-box-inactive.svg';
import { responsiveDataContext } from '../../../context/responsiveContext';

export default function Footer() {
  const [responsiveContext] = useContext(responsiveDataContext);
  const navigate = useNavigate();
  const [selectedDataState] = useContext(selectedDataContext);
  const [navigationState, setnavigationState] = useState(true);

  React.useEffect(() => {
    if (
      selectedDataState.dataTypes.units &&
      selectedDataState?.location.length
    ) {
      setnavigationState(false);
    } else {
      setnavigationState(true);
    }
  }, [selectedDataState]);
  return (
    <div className="panel-footer">
      <div className="row align-items-center">
        <div className="col-md-12">
          <div className="ft-checkbox-part">
            <ul>
              <li>
                <div className="ft-checkbox">
                  <img alt="" src={glyphsInputCheckBoxDefault} />
                </div>
                <div className="ft-data-define"> Data available </div>
              </li>
              <li>
                <div className="ft-checkbox">
                  <img alt="" src={glyphsInputCheckBoxInactive} />
                </div>
                <div className="ft-data-define"> No combination </div>
              </li>
              <li>
                <div className="ft-checkbox">
                  <img alt="" src={glyphsInputCheckBoxUnavailable} />
                </div>
                <div className="ft-data-define"> Data unavailable </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="reports-btn-part">
          <div className="tooltip-wrapper pull-right">
            {!responsiveContext && (
              <button
                className="button--primary-light nextBtn"
                type="button"
                disabled={navigationState}
                onClick={() => {
                  navigate(UrlNavigation(selectedDataState));
                }}
              >
                View charts
              </button>
            )}
            {navigationState === true && (
              <span disabled={navigationState} className="small-tooltip--text">
                You must select an energy and data type and a location to
                continue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
