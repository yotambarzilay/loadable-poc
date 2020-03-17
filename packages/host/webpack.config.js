const HtmlWebPackPlugin = require("html-webpack-plugin");
const LoadablePlugin = require("@loadable/webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const path = require("path");
const DIST_PATH = path.resolve(__dirname, 'dist')
const development =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const getConfig = target => ({
  name: target,
  resolve: {
    extensions: [".js", ".jsx"]
  },
  mode: development ? "development" : "production",
  target: target === 'client' ? 'web' : 'node',
  entry: {
    [target === "client" ? "main" : target]: `./src/${target}.js`
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            caller: { target }
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  externals:
    target === "server" ? ["@loadable/component", nodeExternals()] : undefined,
  output: {
    path: path.join(DIST_PATH, target),
    filename: "[name].js",
    publicPath: `/dist/${target}/`,
    libraryTarget: target === "server" ? "commonjs2" : undefined
  },
  plugins: [
    /*
      Generates loadable-stats.json for consumption in ChunksExtractor (app.js).
      Per @loadable's documentation, since we already produce stats.json in our builds,
      it can be used instead.
      See: https://loadable-components.com/docs/server-side-rendering/#using-your-own-stats-file
    */
    new LoadablePlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.ejs",
      filename: "./index.ejs",
      inject: false
    })
  ]
});

module.exports = [getConfig("client"), getConfig("server")];

