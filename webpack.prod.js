const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'vue-accessible-datepicker.min.js',
    libraryExport: 'default',
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    })
  ]
};
