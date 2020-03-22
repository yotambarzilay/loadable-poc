import * as compLoaders from "./components/loader";
import {componentLoaders} from 'comps-lib'

export const loadComps = async () => {
  const compsEntries = await Promise.all(
    Object.entries({...compLoaders, ...componentLoaders}).map(async ([compName, comp]) => [
      compName,
      await comp.load().then(() => comp)
    ])
  );
  return compsEntries.reduce((comps, [compName, comp]) => {
    comps[compName] = comp;
    return comps;
  }, {});
};
