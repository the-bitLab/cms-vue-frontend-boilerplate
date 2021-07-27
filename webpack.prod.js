const path = require("path")
const common = require("./webpack.common")
const merge = require("webpack-merge")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // only need in prod cuz dev is using in-memory server
const postCssConfig = require("./src/scss/postcss.config")
const twigNamespaces = require("./twig-namespace").default;

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'js/[name].js',
        publicPath: '/wp-content/themes/maxxima/assets/'
    },
    module: {
        rules: [
            {
                test: /\.twig$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: {
                                list: [
                                    '...',
                                    {
                                        tag: 'use',
                                        attribute: 'xlink:href',
                                        type: 'src',
                                        filter: () => false
                                    },
                                    {
                                        tag: 'use',
                                        attribute: 'href',
                                        type: 'src',
                                        filter: () => false
                                    },
                                    {
                                        tag: 'link',
                                        attribute: 'href',
                                        type: 'src',
                                        filter: () => false
                                    },
                                ]
                            },
                            minimize: false
                        }
                    },
                    {
                        loader: 'twig-html-loader',
                        options: {
                            namespaces: twigNamespaces,
                            data: require('./src/data')
                        }
                    }
                ]
            },
            {
                test: /\.(mp4)$/,
                type: 'asset/resource',
                generator: {
                    filename: "videos/[name][ext][query]"
                }
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                exclude: /fonts/,
                type: 'asset/resource',
                generator: {
                    filename: "img/[name][ext]"
                }
            },
            {
                test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
                exclude: [/img/, /img\/icons/],
                type: 'asset/resource',
                generator: {
                    filename: "fonts/[name][ext]"
                }
            },
            {
                test: /.(sa|sc|c)ss$/,
                use: [
                    // Transform css and extract into separate single bundle
                    // Required to generate the file
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },

                    {
                        loader: "css-loader",
                        // options: { url: false }
                    },

                    // apply postcss transforms like autoprefixer and minify
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: postCssConfig
                        }
                    },

                    "resolve-url-loader",

                    // transform SASS to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            additionalData: `
                                @import "src/scss/theming";
                            `,
                            sourceMap: true
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        })
    ],
    optimization: {
        runtimeChunk: {
            name: entrypoint => `runtimechunk~${entrypoint.name}`
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                }
            }
        }
    }
})