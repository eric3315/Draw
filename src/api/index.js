import axios from 'axios';
import Qs from 'qs';
axios.defaults.baseURL = 'http://hd.114utrip.com/api';
// axios.defaults.baseURL = 'http://test.admin.skepay.com/api';
axios.defaults.withCredentials = true;
axios.defaults.transformRequest = (data = {}) => Qs.stringify(data);
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.interceptors.response.use(result => result.data);
export default axios;


