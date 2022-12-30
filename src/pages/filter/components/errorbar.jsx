import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectedDataContext } from '../../../context/selectedData';
import { UrlNavigation } from '../../../utils';

export default function ErrorBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDataState, setselectedDataState] =
    useContext(selectedDataContext);

  const okConfirmClick = () => {
    setselectedDataState({
      ...selectedDataState,
      errorbar: false,
      lastRemovedItem: [],
    });
    if (window.location.href.search('/results') !== -1) {
      navigate('/results/', { replace: true });
    }
  };

  const okUndoClick = () => {
    setselectedDataState({
      ...selectedDataState,
      errorbar: false,
      dataTypes: selectedDataState?.lastRemovedItem?.units
        ? selectedDataState.lastRemovedItem
        : selectedDataState.dataTypes,
      location: selectedDataState?.lastRemovedItem?.location
        ? [selectedDataState.lastRemovedItem.location]
        : selectedDataState.location,
      lastRemovedItem: [],
    });

    const splitUrl = location.pathname.split('results/')[1];
    if (window.location.href.search('/results') !== -1) {
      const url = UrlNavigation(
        {
          ...selectedDataState,
          dataTypes: selectedDataState.lastRemovedItem,
        },
        splitUrl,
        splitUrl?.split('view/')[1]
      );
      if (url) {
        setselectedDataState({
          ...selectedDataState,
          errorbar: false,
          lastRemovedItem: [],
        });
      }
      navigate(url);
    }
  };

  return (
    <>
      {selectedDataState.errorbar && (
        <div className="alertbox">
          <div className="alert alert-general" role="alert">
            <span>
              <p className="alert-text">
                You must select an energy and data type and a location to
                proceed
              </p>
              <ul className="alert-btns">
                <li>
                  <button
                    type="button"
                    onClick={() => okConfirmClick()}
                    className="btn minor-label"
                  >
                    Confirm changes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => okUndoClick()}
                    className="btn major-label"
                  >
                    Undo
                  </button>
                </li>
              </ul>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
