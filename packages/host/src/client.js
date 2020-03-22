import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./components/App";
import { loadComps } from "./loadComps";
import { loadableReady } from "@loadable/component";

const promisifyLoadableReady = namespace =>
  new Promise(resolve => loadableReady(resolve, { namespace }));

const run = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const comps = await loadComps();
  const container = document.getElementById("container");

  await Promise.all([
    promisifyLoadableReady(),
    promisifyLoadableReady("compsLib")
  ]);

  ReactDom.hydrate(<App comps={comps} />, container);
};

run();
