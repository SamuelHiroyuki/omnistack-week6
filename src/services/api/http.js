import axios from 'axios'

const http = axios.create({
    baseURL: 'https://omnicourse-api.herokuapp.com'
});

export default http;