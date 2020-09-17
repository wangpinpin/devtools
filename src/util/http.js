import axios from 'axios';
import store from "@/store";

axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
//http request 拦截器
axios.interceptors.request.use(
    config => {
        // config.data = JSON.stringify(config.data);
        config.headers = {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Authorization': store.state.user.token
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);
//响应拦截器即异常处理
axios.interceptors.response.use(response => {

    //单独处理别的网站返回结果
    if (response.config.url.startsWith("http")) {
        return response;
    }

    if (response.data.code == 0) {
        return response.data
    } else {
        window.$notify.warning({
            title: '警告',
            message: response.data.msg,
            position: 'bottom-right'
        });
    }
}, err => {
    let msg = "";
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                msg = '错误请求';
                break;
            case 401:
                msg = '未授权，请重新登录';
                break;
            case 403:
                msg = '拒绝访问';
                break;
            case 404:
                msg = '请求错误,未找到该资源';
                break;
            case 405:
                msg = '请求方法未允许';
                break;
            case 408:
                msg = '请求超时';
                break;
            case 500:
                msg = '服务器端出错';
                break;
            case 501:
                msg = '网络未实现';
                break;
            case 502:
                msg = '网络错误';
                break;
            case 503:
                msg = '服务不可用';
                break;
            case 504:
                msg = '网络超时';
                break;
            case 505:
                msg = 'http版本不支持该请求';
                break;
            default:
                msg = `连接错误${err.response.status}`;
        }

    } else {
        msg = '连接到服务器失败';
    }
    window.$notify.error({
        title: '异常',
        message: msg,
        position: 'bottom-right'
    });
    return Promise.resolve(err.response)
})


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(response => {
                if (response) {
                    resolve(response.data);
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {
                if (response) {
                    resolve(response.data);
                }
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                if (response) {
                    resolve(response.data);
                }
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                if (response) {
                    resolve(response.data);
                }
            }, err => {
                reject(err)
            })
    })
}
export default {
    get,
    post,
    patch,
    put,
}