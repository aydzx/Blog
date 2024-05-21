import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import cors from 'cors';


import * as validations from './validations.js'

import {checkAuth, handleValidationError} from './utils/index.js'

import {UserController, PostController} from './controllers/index.js'

mongoose
    .connect(
    'mongodb+srv://?:?@cluster0.rtwuhcf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error:', err));

const app = express();
app.use(express.json());

app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', validations.loginValidation, handleValidationError, UserController.login);
app.post('/auth/register', validations.registerValidation, handleValidationError, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, validations.postCreateValidation, handleValidationError, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, validations.postCreateValidation, handleValidationError, PostController.update);

app.listen(4444, (err) => {
    if (err) {
    return console.log(err);
    }
    console.log('Server OK!');
}
);