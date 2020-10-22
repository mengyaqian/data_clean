module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/hce": {
        target: "https://repository.chinanorth.cloudapp.chinacloudapi.cn",
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
