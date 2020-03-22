function isWebTarget(caller) {
  return Boolean(caller && caller.target === "client");
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === "babel-loader");
}

module.exports = api => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);

  return {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env",
        {
          targets: web
            ? { browsers: "latest", esmodules: true }
            : { node: "current" },
          modules: webpack ? false : "commonjs"
        }
      ]
    ],
    /*
      Transform the dynamic import method call (e.g. `loadable(() => import('Component.tsx'))`) to an object
      with information about the chunkName, and other node related methods
    */
    plugins: ["@loadable/babel-plugin"]
  };
};
