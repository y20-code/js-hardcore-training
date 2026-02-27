import axios from 'axios';

const request = axios.create({
    baseURL:'https://api.word-killer.com',
    timeout:5000
})

//请求拦截器
request.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
})

//响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data.data
    },(error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('token')
            window.location.href = '/login'
        }else{
            alert(error.response?.data?.message || '网络错误请重试')
        }
        return Promise.reject(error)
    }
)

export default request;