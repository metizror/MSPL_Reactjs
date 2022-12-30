export function defaultChartForQuickCal(value) {
  switch (value) {
    case 'yny_delta':
    case 'yny_delta_10':
    case 'yny_delta_5':
      return 'column';
    case 'cg':
      return 'area';
    case 'annual_g':
    case 'cpg':
    default:
      return 'line';
  }
}
