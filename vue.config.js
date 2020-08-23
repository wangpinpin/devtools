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
    lintOnSave: true,

    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,

    devServer: {
        // port: 8080, // 端口号
        // host: 'localhost',
        // https: false,
        open: true, //配置自动启动浏览器
        disableHostCheck: true
    },

    //rem自动转换
    // css: {
    //     loaderOptions: {
    //         postcss: {
    //             plugins: [
    //                 require("postcss-px2rem")({
    //                     remUnit: 192
    //                 })
    //             ]
    //         }
    //     }
    // }
};