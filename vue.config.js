const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
    js: [
        'https://cdn.bootcss.com/vue/2.6.11/vue.min.js',
        'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
        'https://cdn.bootcss.com/axios/0.18.1/axios.min.js',
        'https://cdn.bootcss.com/element-ui/2.13.0/index.js',
        'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js'
    ]
}

module.exports = {
    publicPath: '',
    productionSourceMap: false,
    outputDir: 'manage',
    assetsDir: 'static',

    chainWebpack: (config) => {
        // 修复HMR(热更新失效)
        config.resolve.symlinks(true)
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 移除 preload 插件
        config.plugins.delete('preload')
        // 压缩代码
        config.optimization.minimize(true)
        // 分割代码
        config.optimization.splitChunks({
            chunks: 'all'
        })

        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))

        // vue-cli3 以上版本默认vue-loader不识别&nbsp; 需要修改preserveWhitespace为true
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap((options) => {
                options.compilerOptions.preserveWhitespace = true
                // 网上的解决方法最后还会添加 return options; 这是错的
            })

        if (isProduction) {
            config.plugin('html').tap((args) => {
                args[0].cdn = cdn
                return args
            })
        }
    },

    configureWebpack: (config) => {
        if (isProduction) {
            /*配置的格式：import包名: 全局变量，
            工作原理就是webpack在读取到import语句时会从externals中去查找对应的全局变量然后加载。
            比如'vue-router': 'VueRouter'，业务代码中使用import router from 'vue-router'，
            webpack就会去查找VueRouter这个全局变量。*/
            config.externals = {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                'element-ui': 'ELEMENT',
                vuex: 'Vuex'
            }
            // 打包生产.gz包
            config.plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
            // 添加自定义代码压缩配置
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_debugger: true,
                            drop_console: true
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )
        }
    },

    devServer: {
        proxy: {
            '/api': {
                target: isProduction ? 'https://www.saitoasuka.xyz' : 'http://localhost:8443', //设置调用的接口域名和端口
                changeOrigin: true, //是否跨域
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/styles/index.scss";`
                // 会在每个style为scss的文件下导入该文件
            }
        }
    }
}
