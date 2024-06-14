module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@babel/preset-env'
  ],
  plugins: [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "@": "./src"
      }
    }],
    '@babel/plugin-transform-runtime'
  ]
}
