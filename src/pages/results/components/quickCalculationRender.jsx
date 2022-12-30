import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { defaultChartForQuickCal, quickCalculationArr } from '../../../utils';

export default function QuickCalculationRender({ currCalVal }) {
  const location = useLocation();
  const navigate = useNavigate();

  const quickCalculationApply = (state) => {
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
      if (state) {
        navigate(
          `${
            location.pathname.split('view/')[0]
          }calc/yny_delta/view/${defaultChartForQuickCal('yny_delta')}`
        );
      } else {
        navigate(
          `${location.pathname.split('calc/')[0]}view/${defaultChartForQuickCal(
            'yny_delta'
          )}`
        );
      }
    }, 1);
  };

  const onCalculationChanged = (value) => {
    if (value === currCalVal) return false;
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
      navigate(
        `${
          location.pathname.split('calc/')[0]
        }calc/${value}/view/${defaultChartForQuickCal(value)}`
      );
    }, 1);
  };

  return (
    <>
      <div className="quick-calculation">
        <div className="quickCalcHead">
          <h4>Quick calculation</h4>
          <div className="applytoresults">
            <label htmlFor="customSwitches">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customSwitches"
                  checked={!!currCalVal}
                  onChange={(event) => {
                    quickCalculationApply(event.target.checked);
                  }}
                />
                <div className="custom-control-label">
                  <span className="switch">
                    <div className="sliderSwitch round active" />
                  </span>
                </div>
              </div>
              <div className="switchlabel">Apply to results</div>
            </label>
          </div>
        </div>

        <div
          className={`quickCalcSelection  ${
            currCalVal ? 'active-section' : ''
          }`}
        >
          <ul>
            {quickCalculationArr.map((value, index) => (
              <li>
                <div className="tooltip-wrapper">
                  <div className="calcText">
                    <label>
                      <input
                        key={index}
                        type="radio"
                        name="quickselection"
                        className="calcRadio"
                        checked={value.key === currCalVal}
                        disabled={!currCalVal}
                        onClick={() => onCalculationChanged(value.key)}
                      />
                      <span>{value.value}</span>
                    </label>
                  </div>
                  <p className="desc-tooltip--text">
                    <span className="">{value.description}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
