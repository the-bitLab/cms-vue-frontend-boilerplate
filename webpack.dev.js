const path =                        require("path")
const common =                      require("./webpack.common")
const merge =                       require("webpack-merge")
const postCssConfig =               require("./src/scss/postcss.config")
const twigNamespaces =              require("./twig-namespace").default;

module.exports = merge(common, {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'js/[name].[contenthash].js'
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
                        }
                    },
                    {
                        loader: 'twig-html-loader',
                        options: {
                            cache: true,
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
                    filename: "assets/videos/[name].[hash][ext][query]"
                }
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                exclude: /fonts/,
                type: 'asset/resource',
                generator: {
                    filename: "assets/img/[name].[hash][ext][query]"
                }
            },
            {
                test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
                exclude: [/img/, /img\/icons/],
                type: 'asset/resource',
                generator: {
                    filename: "assets/fonts/[name].[hash][ext][query]"
                }
            },
            {
                test: /.(sa|sc|c)ss$/,
                exclude: [/node_modules\/overlayscrollbars/],
                use: [
                    'style-loader',
                    
                    { 
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },

                    // apply postcss transforms like autoprefixer and minify
                    { 
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            postcssOptions: postCssConfig
                        }
                    },

                    { loader: "resolve-url-loader", options: { sourceMap: true } },
                    
                    // transform SASS to CSS
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sourceMap: true,
                            additionalData: `
                                @import "src/scss/theming";
                            `
                        }
                    }
                ]
            }
        ]
    },
    devtool: "eval-source-map",
    devServer: {
        overlay: true,
        compress: true,
        contentBase: [
            path.join(__dirname, 'src/templates/')
        ],
        open: true,
        proxy: {
            // '/sample': {
            //     target: 'http://target.host.name',
            //     changeOrigin: true
            // }
        }
    }
})