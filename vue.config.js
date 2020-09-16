module.exports = {
    //部署应用程序的基本URL
    publicPath: "/",

    //npm run build时 生成文件的目录
    outputDir: "dist",

    pages: {
        index: {
            entry: "src/main.js",
            title: "小破站"
        }
    },

    //是否使用eslint
    lintOnSave: false,

    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,

    configureWebpack: {
        performance: {
            hints: 'warning',
            //入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            //生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    devServer: {
        // port: 8080, // 端口号
        // host: 'localhost',
        // https: false,
        open: true, //配置自动启动浏览器
        disableHostCheck: true
    },
};