const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'eval', // Simpler source maps
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/'
    },
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
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        port: 3000,
        hot: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        },
        client: {
            overlay: {
                warnings: false,
                errors: true
            },
            logging: 'error'
        }
    },
    performance: {
        hints: false
    },
    stats: {
        modules: false,
        chunks: false,
        assets: false,
        children: false,
        source: false // Don't show source information
    }
};