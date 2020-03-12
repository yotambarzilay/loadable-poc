import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./components/App";
import { loadComps } from "./loadComps";

const run = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const comps = await loadComps();

  const container = document.getElementById("container");
  ReactDom.render(<App comps={comps} />, container);
};

run();
