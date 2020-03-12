import * as React from "react";
import * as ReactDom from "react-dom";
import App from "./components/App";
import * as compLoaders from "./components/loader";

console.log("hello");

const run = async () => {
  const comps = {
    Button: await compLoaders.Button()
  };

  const container = document.getElementById("container");
  ReactDom.render(<App comps={comps} />, container);
};

run();
