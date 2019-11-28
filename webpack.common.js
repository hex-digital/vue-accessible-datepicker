const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'vue-accessible-datepicker.js',
    library: 'VueAccessibleDatepicker',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.vue', '.js', '.svg'],
    modules: [
      path.join(__dirname, 'node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@img': path.resolve(__dirname, './src/img'),
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  },
}
