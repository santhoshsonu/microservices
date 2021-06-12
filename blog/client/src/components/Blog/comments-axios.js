import axios from "axios";
import config from "../../config/config";

const blogInstance = axios.create({
    baseURL: config.SERVICES.COMMENTS.BASE_URL
})

blogInstance.defaults.headers.post['Content-Type'] = 'application/json';

blogInstance.interceptors.request.use(requestConfig => {
    // console.log('[BlogCommentsInterceptor] Request : ', requestConfig);
    return requestConfig;
}, error => {
    // console.log('[BlogCommentsInterceptor] Error : ', error);
    return Promise.reject(error);
});

blogInstance.interceptors.response.use(response => {
    // console.log('[BlogCommentsInterceptor] Response : ', response);
    return response;
}, error => {
    // console.log('[BlogCommentsInterceptor] Error : ', error);
    return Promise.reject(error);
});

blogInstance.CancelToken = axios.CancelToken;
blogInstance.isCancel = axios.isCancel;

export default blogInstance;