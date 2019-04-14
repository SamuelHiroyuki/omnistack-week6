import http from './http'

export const postBoxes = title => {
    return http.post('Boxes', { title })
        .then(response => response.data);
}

export const getBoxes = id => {
    return http.get(`Boxes/${id}`)
        .then(response => response.data);
}

export const postBoxFile = (id, file) => {
    return http.post(`Boxes/${id}/Files`, file)
        .then(response => response.data);
}