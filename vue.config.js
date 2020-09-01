module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/hce": {
        target: "http://10.0.0.198:5010",
        changeOrigin: true,
      },
    },
  },
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
  transpileDependencies: ["vuex-module-decorators"],
};
