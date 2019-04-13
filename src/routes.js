const express = require('express'); 
const multer = require('multer'); 
const multerConfig = require('./config/multer'); 
const BoxController = require('./controllers/BoxController');
const FileController = require('./controllers/FileController');

const routes = express.Router();

routes.post('/Boxes', BoxController.store);
routes.get('/Boxes/:id', BoxController.show);
routes.post('/Boxes/:id/Files', multer(multerConfig).single('file'), FileController.store);

module.exports = routes;