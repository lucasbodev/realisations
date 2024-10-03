const defaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaults,
  module: {
    rules: [
      // Gérer les images
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Convertit les fichiers de moins de 8kb en base64
              name: '[name].[hash].[ext]',
              outputPath: 'assets',
            },
          },
        ],
      },
      // Ajouter Babel pour gérer les fichiers JS/JSX
      {
        test: /\.(js|jsx)$/, // S'applique aux fichiers .js et .jsx
        exclude: /node_modules/, // Ignorer les fichiers dans node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Transpiler JS moderne + JSX
          },
        },
      },
      // Gérer les fichiers CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Injecte le CSS dans le DOM avec style-loader, puis charge avec css-loader
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
