export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    library: 'BlueprintPackage',
    libraryTarget: 'umd',
  },

  resolve: {
    extensions: ['', '.js'],
  },
};
