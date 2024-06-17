const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    babel: {
      configFile: './client/babel.config.js',
    },
  },
})
