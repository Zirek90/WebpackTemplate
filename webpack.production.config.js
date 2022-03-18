const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const chalk = require("chalk");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "./dist"),
  },
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all", // tell webpack to put external libraries to separate bundle which will be cached separatelly,
      minSize: 6000,  // minimal Size of bundle to separate
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: "asset", // assets - general     assets/resource - separate file     assets/inline -convert to base64
        parser: {
          dataUrlCondition: {
            maxSize: 6 * 1024, // 3kb
          },
        },
      },
      {
        test: /\.txt/,
        type: "asset/source",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // remember to add also sass
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
            plugins: ["@babel/transform-runtime", "@babel/plugin-proposal-class-properties"],
            sourceType: "unambiguous", // Otherwise cannot use async/await and babel throw export error
          },
        },
      }
    ],
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(":percent")} (:elapsed s)`,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", path.join(process.cwd(), "build/**/*")], // clean external directory with files, for some cleanup
    }),
    new HtmlWebpackPlugin({
      title: "Hello world",
      template: "./public/index.html",
      filename: "index.html",
      minify: true,
    })
  ],
};
