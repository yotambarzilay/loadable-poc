import * as compLoaders from "./components/loader";

export const loadComps = async () => {
  const compsEntries = await Promise.all(
    Object.entries(compLoaders).map(async ([compName, comp]) => [
      compName,
      await comp.load().then(() => comp)
    ])
  );
  return compsEntries.reduce((comps, [compName, comp]) => {
    comps[compName] = comp;
    return comps;
  }, {});
};
