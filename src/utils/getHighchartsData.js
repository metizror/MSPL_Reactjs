import { configMaster } from '../data-layer/data-layer';

const minMaxYear = (energy_datatypeArray, contextData, energyType) => {
  let minYear = 99999;
  let maxYear = 0;
  if (energyType === 'et') {
    energy_datatypeArray.forEach((energy_datatype) => {
      contextData.forEach((country) => {
        const yearArray = Object.keys(energy_datatype[country]);

        if (minYear > Number(yearArray[0])) {
          minYear = Number(yearArray[0]);
        }
        if (maxYear < Number(yearArray[yearArray.length - 1])) {
          maxYear = Number(yearArray[yearArray.length - 1]);
        }
      });
    });
  } else if (energyType === 'ep') {
    energy_datatypeArray.forEach((element) => {
      const yearArray = Object.keys(element.prices);
      if (minYear > Number(yearArray[0])) {
        minYear = Number(yearArray[0]);
      }
      if (maxYear < Number(yearArray[yearArray.length - 1])) {
        maxYear = Number(yearArray[yearArray.length - 1]);
      }
    });
  }
  return { minYear, maxYear };
};

const convertJsonForTableView = (
  filterData,
  dataValueArr,
  contextData,
  selectedYear
) => {
  const table1data = [];
  const columns = [];
  dataValueArr = [];

  if (window.location.href.search('/ep/') !== -1) {
    filterData.forEach((element) => {
      table1data.push({
        name: element.datatype,
        units: element['Y-Axis-Legend'],
      });
    });
    if (filterData && filterData[0] && filterData[0]?.prices) {
      for (let i = selectedYear.from; i <= selectedYear.to; i++) {
        columns.push({ path: i, name: i });
      }

      filterData.forEach((element) => {
        const dataValue = [];
        for (let i = selectedYear.from; i <= selectedYear.to; i++) {
          if (element?.prices[i]) {
            dataValue.push(element.prices[i].toFixed(2));
          } else {
            dataValue.push(null);
          }
        }
        dataValueArr.push({ data: dataValue });
      });
    }
  } else {
    filterData.forEach((element2) => {
      contextData.location.forEach((element) => {
        if (columns.length === 0) {
          for (let i = selectedYear.from; i <= selectedYear.to; i++) {
            columns.push({ path: i, name: i });
          }
        }

        const dataValue = [];

        table1data.push({
          name: configMaster[element],
          units: [
            configMaster[element2.key.split('_')[0]],
            configMaster[element2.key.split('_')[1]],
            contextData.dataTypes.units,
          ],
        });

        for (let i = selectedYear.from; i <= selectedYear.to; i++) {
          if (element2[element][i] !== undefined) {
            dataValue.push(element2[element][i].toFixed(2));
          } else {
            dataValue.push(null);
          }
        }
        dataValueArr.push({ data: dataValue });
      });
    });
  }

  const table1columns = [
    { path: 'name', name: 'Region / Grouping' },
    { path: 'units', name: 'Units' },
  ];
  return { table1data, table1columns, columns, dataValueArr };
};

const chartsDataArr = (dataYear, dataValueArr, unit, quickCalculations) => {
  if (quickCalculations === 'cpg' || quickCalculations === 'annual_g') {
    unit = '%';
  }
  const chartsData = {
    chart: {
      style: {
        fontFamily: 'roboto',
      },
      events: {
        load() {
          this.renderer
            .image(
              'https://staticcontents.investis.com/media/b/bp/watermark.svg',
              70,
              10,
              50,
              64
            )
            .add();
        },
        redraw() {
          document.getElementById('spinner').style.display = 'block';
        },
        render() {
          document.getElementById('spinner').style.display = 'none';
        },
        // Note: Have tried option of customizing using exporting but it won't work
      },
      backgroundColor: 'rgba(0,0,0,0)',
    },

    title: {
      text: '',
    },

    accessibility: {
      description: 'Results of energy types based on selections',
    },
    colors: [
      '#009de0',
      '#6533c9',
      '#ff6600',
      '#ffcc00',
      '#99cc00',
      '#dc0000',
      '#666666',
      '#3da599',
      '#006600',
      '#000099',
      '#8bdeff',
      '#3366ff',
      '#cd9bff',
      '#993366',
      '#ff9999',
      '#c49000',
      '#c8fb8d',
      '#009900',
      '#ff9900',
      '#fdf000',
      '#993333',
      '#cc0033',
    ],
    credits: {
      enabled: false,
    },

    responsive: {
      rules: [
        {
          condition: {
            callback() {
              return window.innerWidth < 1200;
            },
          },
          chartOptions: {
            tooltip: {
              positioner: function (labelWidth, labelHeight, point) {
                let tooltipX = point.plotX + 61;
                if (tooltipX > 210) {
                  tooltipX = point.plotX - 143;
                }
                return {
                  x: tooltipX,
                  y: this.chart.plotTop,
                };
              },
            },
          },
        },
        {
          condition: {
            callback() {
              return window.innerWidth < 769;
            },
          },
          chartOptions: {
            tooltip: {
              backgroundColor: '#fff',
              shadow: false,
              distance: 40,
              outside: true,
              positioner() {
                const point = this;
                const { chart } = point;
                const chartPosition = chart.pointer.getChartPosition();
                const { distance } = point;
                return {
                  x: chartPosition.left - distance,
                  y: chartPosition.top + point.label.height + 90,
                };
              },
            },
          },
        },
      ],
    },

    xAxis: {
      //   type: 'Year',
      //   categories: dataYear,
      crosshair: true,
      title: {
        text: 'Year',
      },
      labels: {
        style: {
          fontSize: '10px',
        },
      },
    },
    yAxis: {
      title: {
        text: unit,
      },
      labels: {
        style: {
          fontSize: '10px',
        },
      },
      opposite: false,
    },
    tooltip: {
      positioner(labelWidth, labelHeight, point) {
        let tooltipX = point.plotX + 51;
        if (tooltipX > 400) {
          tooltipX = point.plotX - 150;
        }
        return {
          x: tooltipX,
          y: this.chart.plotTop,
        };
      },
      shared: true,
      split: false,
      enabled: true,
      borderWidth: 0,
      backgroundColor: 'rgba(255,255,255,0.3)',
      fontSize: '10px',
      fontFamily: 'roboto',
      shadow: false,
      useHTML: true,
      style: {
        pointerEvents: 'auto',
      },
      formatter() {
        let formattedString = `<div class="tooltip-box">
          <table style="color: #333">
             <tr>
                <th colspan="2" style="text-align: right;font-size:9px;">
                   ${new Date(this.x).getFullYear()}
                </th>
             </tr>`;
        const dataLabel = {};
        this.points.forEach((elem) => {
          if (dataLabel[elem.point.key]) {
            dataLabel[elem.point.key] += `<tr>
            <td>
               <span class="tooltip_energy_indicator" style="background:${
                 elem.series.color
               }">
               </span>
               <span class="tooltip_energy_text">${
                 elem.series.name.split('_')[0]
               } </span>
            </td>
            <td style="text-align: right">
               ${elem.y.toFixed(2)}
            </td>
         </tr>`;
          } else {
            dataLabel[
              elem.point.key
            ] = `<tr style="padding-bottom: 4px; padding-top: 10px; border-bottom:1px solid #fff;">
            <th style="font-weight:500">
            ${elem.point.energy}
            </th>
            <th style="text-align: right; font-size:9px;">
            ${elem.point.dataType} ${unit}
            </th>
         </tr>
         <tr>
            <td>
               <span class="tooltip_energy_indicator" style="background:${
                 elem.series.color
               }">
               </span>
               <span class="tooltip_energy_text">${
                 elem.series.name.split('_')[0]
               }</span>
            </td>
            <td style="text-align: right">
               ${elem.y.toFixed(2)}
            </td>
         </tr>`;
          }
        });
        Object.values(dataLabel).forEach((element) => {
          formattedString += element;
        });

        formattedString += `</table></div>`;
        return formattedString;
      },
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 1,
          },
        },
        showInNavigator: true,
      },
      area: {
        stacking: 'normal',
      },
      column: {
        stacking: 'normal',
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    rangeSelector: {
      enabled: false,
    },
    exporting: {
      csv: {
        dateFormat: '%Y',
      },
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
      chartOptions: {
        xAxis: [
          {
            labels: {
              useHTML: true,
            },
          },
        ],
        legend: {
          labelFormatter() {
            return this.name.split('_')[0];
          },
          enabled: true,
        },
      },
    },
    navigator: {
      xAxis: {
        labels: {
          formatter() {
            return '';
          },
        },
      },
      buttonOptions: {
        enabled: false,
      },
    },
    series: dataValueArr,
  };
  if (
    dataValueArr[0].type === 'column' &&
    window.location.hash.search('bar') !== -1
  ) {
    chartsData.plotOptions.column.stacking = null;
  }
  return chartsData;
};

const createYearRange = (splitUrl, selectedYear, dataYear, minMaxData) => {
  const currCalVal = splitUrl.split('calc/')[1].split('/view')[0].split('/')[0];
  switch (currCalVal) {
    case 'yny_delta':
      for (let i = selectedYear.from; i <= selectedYear.to; i++) {
        if (i % 1 === 0 && i - Number(minMaxData.minYear) >= 1) {
          dataYear.push(i);
        }
      }
      break;
    case 'yny_delta_5':
      for (let i = selectedYear.from; i <= selectedYear.to; i++) {
        if (i % 5 === 0 && i - Number(minMaxData.minYear) >= 5) {
          dataYear.push(i);
        }
      }
      break;
    case 'yny_delta_10':
      for (let i = selectedYear.from; i <= selectedYear.to; i++) {
        if (i % 10 === 0 && i - Number(minMaxData.minYear) >= 10) {
          dataYear.push(i);
        }
      }

      break;
    default:
      for (let i = selectedYear.from; i <= selectedYear.to; i++) {
        dataYear.push(i);
      }
  }
  return dataYear;
};

const deltaLogic = (
  element,
  dataValue,
  n,
  energy,
  dataType,
  allData,
  minMaxData
) => {
  Object.entries(element).forEach((value, key) => {
    if (
      Number(value[0]) % n === 0 &&
      Number(value[0]) - Number(minMaxData.minYear) >= n
    ) {
      if (
        value[1] === undefined ||
        allData[Number(value[0]) - n] === undefined
      ) {
        value[1] = null;
      } else {
        value[1] -= allData[Number(value[0] - n)];
      }
      dataValue = setDataValue(dataValue, value[1], energy, dataType, value[0]);
    }
  });
  return dataValue;
};

const setDataValue = (dataValue, value, energy, dataType, year) => {
  dataValue.push({
    x: Date.UTC(Number(year)),
    y: parseFloat(parseFloat(value).toFixed(2)),
    key: `${energy}_${dataType}`,
    energy,
    dataType,
  });
  return dataValue;
};

const cumulativeGrothLogic = (
  element,
  dataValue,
  energy,
  dataType,
  percentage = ''
) => {
  let firstVal = '';

  const values = Object.entries(element);
  for (let i = 0; i < values.length; i++) {
    if (values[i][1] !== 0 && values[i][1] !== '') {
      firstVal = values[i][1];
      break;
    }
  }

  values.forEach(([key, value], index) => {
    if (isLeapYear(key)) {
      value *= 365 / 366;
    }
    if (index === 0) {
      value = 0;
    } else if (percentage === '%') {
      value = (100 * (value - firstVal)) / firstVal;
    } else {
      value -= firstVal;
    }

    dataValue = setDataValue(dataValue, value, energy, dataType, key);
  });
  return dataValue;
};

const annualGrothLogic = (element, dataValue, energy, dataType) => {
  Object.entries(element).forEach(([key, value], index) => {
    if (isLeapYear(key)) {
      value *= 365 / 366;
    }
    if (index === 0) {
      value = 0;
    } else {
      value = Object.values(element)[index] - Object.values(element)[index - 1];
      if (
        Object.values(element)[index] === undefined ||
        Object.values(element)[index - 1] === undefined
      ) {
        value = null;
      } else {
        value = (value * 100) / Object.values(element)[index - 1];
      }
    }

    dataValue = setDataValue(dataValue, value, energy, dataType, key);
  });
  return dataValue;
};

function isLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

const calculateDataBasedOnFormula = (
  element,
  dataValue,
  splitUrl,
  energy,
  dataType,
  allData,
  minMaxData
) => {
  const currCalVal = splitUrl.split('calc/')[1].split('/view')[0].split('/')[0];
  switch (currCalVal) {
    case 'yny_delta':
      dataValue = deltaLogic(
        element,
        dataValue,
        1,
        energy,
        dataType,
        allData,
        minMaxData
      );
      break;
    case 'yny_delta_5':
      dataValue = deltaLogic(
        element,
        dataValue,
        5,
        energy,
        dataType,
        allData,
        minMaxData
      );
      break;
    case 'cg':
      dataValue = cumulativeGrothLogic(element, dataValue, energy, dataType);
      break;
    case 'annual_g':
      dataValue = annualGrothLogic(element, dataValue, energy, dataType);
      break;
    case 'yny_delta_10':
      dataValue = deltaLogic(
        element,
        dataValue,
        10,
        energy,
        dataType,
        allData,
        minMaxData
      );
      break;
    case 'cpg':
      dataValue = cumulativeGrothLogic(
        element,
        dataValue,
        energy,
        dataType,
        '%'
      );
      break;
    default:
      Object.values(element).forEach((yearData) => {
        dataValue.push(parseFloat(parseFloat(yearData + 35).toFixed(2)));
      });
  }
  return dataValue;
};

export const getHighchartsData = async (
  contextData,
  type,
  splitUrl,
  selectedYear,
  currCalVal
) => {
  if (!contextData) return {};
  if (type === 'bar') {
    type = 'column';
  }
  let filterData = '';
  let chartsData = {};
  const dataValueArr = [];
  let minMaxData = [];

  if (splitUrl && splitUrl.search('ep/') !== -1) {
    let energy = '';
    await import(`../data/energy-prices.json`).then((energyPrice) => {
      filterData = energyPrice[contextData].values;
      energy = energyPrice[contextData].title;

      minMaxData = minMaxYear(filterData, contextData.location, 'ep');
      if (selectedYear.from === null) {
        selectedYear.from = minMaxData.minYear;
        selectedYear.to = minMaxData.maxYear;
      }
      const dataValueArr = [];
      let dataYear = [];

      filterData.forEach((element) => {
        dataYear = [];
        let dataValue = [];
        if (splitUrl && splitUrl.search('calc/') !== -1) {
          const temp = {};

          if (
            Number(Object.entries(element.prices)[0][0]) - minMaxData?.minYear >
            0
          ) {
            const firstYearVal = Number(Object.entries(element.prices)[0][0]);
            for (let year = minMaxData?.minYear; year < firstYearVal; year++) {
              element.prices[year] = '';
            }
          }

          Object.entries(element.prices).forEach((element2) => {
            if (
              element2[0] >= selectedYear.from &&
              element2[0] <= selectedYear.to
            ) {
              temp[element2[0]] = element2[1];
            }
          });
          dataValue = calculateDataBasedOnFormula(
            temp,
            dataValue,
            splitUrl,
            energy,
            '',
            element.prices,
            minMaxData
          );
        } else {
          for (let i = selectedYear.from; i <= selectedYear.to; i++) {
            dataYear.push(i);
            const found = Object.entries(element.prices).find(
              (e) => Number(e[0]) === Number(i)
            );
            if (found) {
              dataValue.push({
                x: Date.UTC(Number(i)),
                y: parseFloat(parseFloat(found[1]).toFixed(2)),
                energy,
                dataType: '',
              });
            } else {
              dataValue.push({
                x: Date.UTC(Number(i)),
              });
            }
          }
        }
        if (splitUrl && splitUrl.search('/calc') !== -1) {
          dataYear = createYearRange(
            splitUrl,
            selectedYear,
            dataYear,
            minMaxData
          );
        }
        dataValueArr.push({
          data: dataValue,
          name: element.datatype,
          showInLegend: true,
          type,
          marker: {
            symbol: 'circle',
          },
        });
      });

      if (type !== 'table') {
        chartsData = chartsDataArr(
          dataYear,
          dataValueArr,
          filterData[0]['Y-Axis-Legend'],
          currCalVal
        );
      }
    });
  } else {
    const data = [];
    await Promise.all(
      contextData.dataTypes.energy.map((file) =>
        import(`../data/${file.key}.json`)
      )
    ).then(async (files) => {
      await contextData.dataTypes.energy.map(async (element, index) => {
        element.types.forEach((types) => {
          const tempArr = files[index][types.key][contextData.dataTypes.units];
          data.push({
            key: `${element.key}_${types.key}`,
            ...tempArr,
          });
        });
      });
      minMaxData = minMaxYear(data, contextData.location, 'et');
      filterData = data;
      let dataYear = [];
      await filterData.map((element) => {
        const [energy, dataType] = element.key.split('_');
        contextData.location.forEach((country) => {
          dataYear = [];
          let dataValue = [];
          if (selectedYear.from === null) {
            selectedYear.from = minMaxData.minYear;
            selectedYear.to = minMaxData.maxYear;
          }
          if (splitUrl && splitUrl.search('calc/') !== -1) {
            const temp = {};
            Object.entries(element[country]).forEach((element2) => {
              if (
                element2[0] >= selectedYear.from &&
                element2[0] <= selectedYear.to
              ) {
                temp[element2[0]] = element2[1];
              }
            });
            dataValue = calculateDataBasedOnFormula(
              temp,
              dataValue,
              splitUrl,
              configMaster[energy],
              configMaster[dataType],
              element[country],
              minMaxData
            );
            dataYear = createYearRange(
              splitUrl,
              selectedYear,
              dataYear,
              minMaxData
            );
          } else {
            for (let i = selectedYear.from; i <= selectedYear.to; i++) {
              dataYear.push(i);
              const found = Object.entries(element[country]).find(
                (e) => Number(e[0]) === Number(i)
              );
              if (found) {
                dataValue.push({
                  x: Date.UTC(Number(i)),
                  y: parseFloat(parseFloat(found[1]).toFixed(2)),
                  key: `${energy}_${dataType}`,
                  energy: configMaster[energy],
                  dataType: configMaster[dataType],
                });
              } else {
                dataValue.push({
                  x: Date.UTC(Number(i)),
                });
              }
            }
          }

          dataValueArr.push({
            data: dataValue,
            name: `${configMaster[country]}_${element.key}`,
            showInLegend: true,
            type,
            marker: {
              symbol: 'circle',
            },
          });
        });
      });
      if (type !== 'table') {
        chartsData = chartsDataArr(
          dataYear,
          dataValueArr,
          contextData.dataTypes.units,
          currCalVal
        );
      }
    });
  }
  const tableData = convertJsonForTableView(
    filterData,
    dataValueArr,
    contextData,
    selectedYear
  );
  return { chartsData, tableData, minMaxData };
};
