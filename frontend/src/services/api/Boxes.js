import http from './http'

export const postBoxes = title => {
    return http.post('Boxes', { title })
        .then(response => response.data);
}