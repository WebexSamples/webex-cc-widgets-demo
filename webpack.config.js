const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports =  {
  entry: './src/index.jsx', // Entry file for bundling
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
          {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [
          path.resolve('node_modules/@momentum-ui'), // Include specific node module,
          path.resolve('node_modules/react-toastify'), // Include specific node module
          path.resolve('node_modules/@momentum-design'),
          path.resolve('src'),
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader', // Turns CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
        include: [
          path.resolve('node_modules/@momentum-ui'), // Include specific node module,
          path.resolve('node_modules/@momentum-design'),
          path.resolve('src'), 
        ],
      },
       {
        test: /\.(png|jpg|gif|svg)$/,
        include: [
          path.resolve('node_modules/@momentum-ui'),
          path.resolve('node_modules/@momentum-design'),
        ],

        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file name
    clean: true, // Clean dist folder before each build
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template HTML file
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'public'), // Serve files from public folder
    compress: true, // Enable gzip compression
    port: 3000, // Port for the dev server
    open: false, // Open the app in browser on start
    liveReload: true, // Reload page on changes
  },
};
