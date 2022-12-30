import React, { useRef } from 'react';
import { PropTypes } from 'prop-types';

export default function TableRender({ data }) {
  const nametable = useRef(null);
  React.useEffect(() => {
    document.getElementById('spinner').style.display = 'none';
  }, [data]);
  React.useEffect(() => {
    const leftTableParent = document.getElementById('leftTableData');
    const leftTableTR = leftTableParent.getElementsByTagName('tr');

    const rightTableParent = document.getElementById('rightTableData');
    const rightTableTR = rightTableParent.getElementsByTagName('tr');

    const allTRheight = [];
    for (let i = 0; i <= leftTableTR.length - 1; i++) {
      allTRheight[i] = leftTableTR[i].offsetHeight;
      rightTableTR[i].style.height = `${allTRheight[i]}px`;
    }
  });

  return (
    <div className="tableParent">
      <div className="tableContainer">
        <div className="tableleft">
          <table ref={nametable} className="resultTable" id="leftTableData">
            <tbody>
              <tr>
                {data?.table1columns?.map(({ name, i }) => (
                  <th key={name + i}>{name}</th>
                ))}
              </tr>
              {data?.table1data?.map((rowData, i) => (
                <tr key={rowData.name + i}>
                  {data.table1columns.map(({ path, j }) => (
                    <td key={path + j}>
                      {path === 'units' &&
                      window.location.href.search('/et/') !== -1 ? (
                        <div className="sml-blck">
                          <span>{rowData[path][0]}</span>
                          <span>
                            {rowData[path][1]} {rowData[path][2]}
                          </span>
                        </div>
                      ) : (
                        rowData[path]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tableright">
          <table className="resultTable" id="rightTableData">
            <tbody>
              <tr>
                {data?.columns.map(({ name, i }) => (
                  <th key={`${name}${i}`}>{name}</th>
                ))}
              </tr>
              {data?.dataValueArr.map((rowData, j) => (
                <tr key={`${rowData.data}${j}`}>
                  {rowData.data.map((rowdata2, index) => (
                    <td key={index}>{rowdata2}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="clearfix" />
      </div>
    </div>
  );
}
TableRender.propTypes = {
  data: PropTypes.node.isRequired,
};
