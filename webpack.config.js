const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const tsImportPluginFactory = require("ts-import-plugin")

const modifyVars = require('./config/modifyVars')

module.exports = env => {
  const config = {
    mode: env === "development" ? "development" : "production",
    entry: {
      app: "./src/index.js"
    },
    output: {
      path: path.resolve(__dirname, "app"),
      filename:
        env === "development" ? "js/[name].dev.js" : "[name].[chunkhash:8].js",
      chunkFilename:
        env === "development" ? "js/[name].dev.js" : "[name].[chunkhash:8].js",
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: "hh",
        filename: "index.html",
        template: "index.html",
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true
        }
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env)
      }),
      new MiniCssExtractPlugin({
        filename:
          env === "development"
            ? "css/[name].dev.css"
            : "[name].[chunkhash:8].css",
        chunkFilename:
          env === "development"
            ? "css/[name].css"
            : "css/[name].[contenthash:8].chunk.css"
      })
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpg|svg|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: env == 'development' ? '[name].dev.[ext]' : '[name].[chunkhash:8].[ext]',
              outputPath: 'app/imgs/',
            }
          }
        },
        {
          test: /\.(css|less)$/,
          use: [
            "css-hot-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true,
                sourceMap: true,
                modifyVars
              }
            }
          ]
        },
        {
          test: /\.js[x]?$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.ts[x]?$/,
          loader: "awesome-typescript-loader",
          options: {
            useCache: true,
            useBabel: false,
            getCustomTransformers: () => ({
              before: [
                tsImportPluginFactory({
                  libraryName: "antd",
                  libraryDirectory: "lib",
                  style: true
                })
              ]
            })
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".tsx", ".less", ".ts"],
      alias: {
        "@": path.resolve(__dirname, "src/containers"),
        "#": path.resolve(__dirname, "src/components"),
        "%": path.resolve(__dirname, "src/static"),
        "$": path.resolve(__dirname, 'config'),
        "&": path.resolve(__dirname, 'src/services')
      }
    },
    devtool: "cheap-eval-source-map",
    optimization: {
      splitChunks: {
        chunks: "all",
        name: "vendor"
      }
    }
  }
  return config
}
