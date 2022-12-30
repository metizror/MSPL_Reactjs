export function createYearValueArray(array) {
  let yearArray = [];
  const valueArray = [];
  let utcDate;
  let sYear = 0;
  for (let i = 0, len = array.length; i < len; i++) {
    const years = Object.keys(array[i]);
    if (years.length > 0) {
      utcDate = new Date(years[0]);
      if (sYear === 0) sYear = utcDate.getFullYear();
      else if (sYear < utcDate.getFullYear()) sYear = utcDate.getFullYear();
    }
  }
  for (let i = 0, len = array.length; i < len; i++) {
    const years = Object.keys(array[i]);
    const values = Object.values(array[i]);
    if (years.length > 0) {
      utcDate = new Date(years[0]);
      if (utcDate.getFullYear() !== sYear) {
        const diff = sYear - utcDate.getFullYear();
        values.splice(0, diff);
        valueArray.push(values);
      } else {
        valueArray.push(values);
        yearArray = years;
      }
    }
  }
  return { yearArray, valueArray };
}
