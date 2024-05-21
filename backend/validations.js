import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'Incorrect Email').isEmail(),
    body('password', 'Minimum char 5').isLength( {min: 5}),
];

export const registerValidation = [
    body('email', 'Incorrect Email').isEmail(),
    body('password', 'Minimum char 5').isLength( {min: 5}),
    body('fullName', 'Input name').isLength( {min: 3}),
    body('avatarUrl', 'Incorrect URL').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter the title').isLength({min: 3}).isString(),
    body('text', 'Enter the text').isLength( {min: 3}).isString(),
    body('tags', 'Invalid tag format').optional().isString(),
    body('imageUrl', 'Incorrect URL').optional().isString(),
];