const urlToNavigate = ({
    isEP,
    etRegion,
    view,
    unit,
    epValue,
    etValue,
    quickCalculationValue,
}) => {
    let url = '';
    url += isEP ? `ep/${epValue}` : `et/${etValue}`;
    url += `/unit/${unit}`;
    url += isEP ? '' : `/regions/${etRegion}`;
    url += quickCalculationValue === '' ? '' : `/calc/${quickCalculationValue}`;
    url += `/view/${view}`;
    return url;
};
export { urlToNavigate };
