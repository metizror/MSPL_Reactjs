import { configMaster } from '../data-layer/data-layer';

export const createContextVariableFromUrl = (splitUrl) => {
  const energyDataTypeUrlKey = splitUrl
    .split('et/')[1]
    .split('/unit')[0]
    .split('/');
  const unit = splitUrl.split('unit/')[1].split('/regions')[0];
  let location = [];
  if (splitUrl.search('calc') !== -1) {
    location = splitUrl.split('regions/')[1].split('/calc')[0].split('/');
  } else {
    location = splitUrl.split('regions/')[1].split('/view')[0].split('/');
  }
  const dataTypes = { energy: [], units: unit };
  energyDataTypeUrlKey.forEach((i) => {
    const energyKey = i.split('-');
    let alreadyExistKey = '';
    dataTypes.energy.map((data, index) => {
      if (data.key === energyKey[0]) alreadyExistKey = index;
    });
    if (alreadyExistKey !== '') {
      dataTypes.energy[alreadyExistKey].types.push({
        key: energyKey[1],
        title: configMaster[energyKey[1]],
        sub: [{ key: energyKey[0], title: `${energyKey[0]} total` }],
      });
    } else {
      dataTypes.energy.push({
        key: energyKey[0],
        types: [
          {
            key: energyKey[1],
            title: configMaster[energyKey[1]],
            sub: [{ key: energyKey[0], title: `${energyKey[0]} total` }],
          },
        ],
      });
    }
  });
  return {
    dataTypes,
    location,
  };
};
