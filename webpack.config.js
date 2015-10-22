module.exports = {
  entry: "./app.js", 
  output: {
    filename: "public/bundle.js"
  }, 
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  }
};