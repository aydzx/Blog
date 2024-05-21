import mongoose from 'mongoose';
import PostModel from '../models/Post.js'

export const getLastTags = async(req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to recieve",
        })
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({path: 'user', select: ['fullName', 'avatarUrl']}).exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to recieve",
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel
            .findOneAndUpdate(
                { 
                    _id: postId 
                },
                { 
                    $inc: { viewsCount: 1 } 
                },
                { 
                    returnDocument: "After" 
                })
            .populate('user')
            .then(doc => res.json(doc))
            .catch(err => {
                console.warn(err);
                res.status(500)
                .json({ message: "Статья не найдена" })});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to recieve",
        })
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel
            .findOneAndDelete(
                {
                    _id: postId,
                })
            .then(doc => {
                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена",
                    });
                }
                res.json({
                success: true,
                });
                })
            .catch(err => {
                console.log(err);    
                res.status(500).json({
                message: "Article not found or Failed to delete",
            })}
            );
        

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to delete",
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId,
            },
        );

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to update",
        })
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to create",
        })
    }
};