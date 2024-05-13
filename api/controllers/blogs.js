const Blog = require('../models/blog');
const Graff = require('../models/graff');
const mongoose = require('mongoose');

exports.get_all_blogs = (req, res, next) => {
    Blog
    .find()
    .select('-__v')
    .populate('graff', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            blogs: docs.map(doc =>{
                return{
                    _id: doc._id,
                    graff: doc.graff,
                    description: doc.description
                }
            })
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    });
}

exports.create_blog = (req, res, next) => {
    Graff.findById(req.body.graffId)
    .then(graff => {
        if(!graff){
            throw 404;
        }
        const blog = new Blog({
            _id: new mongoose.Types.ObjectId(),
            description: req.body.description,
            graff: req.body.graffId
        });
        return blog.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Blog saved!',
            CreatedBlog: {
                _id: result._id,
                graff: result.graff,
                description: result.description
            }
        });
    })
    .catch(error => {
        console.log(error);
        if (error == 404){
            res.status(404).json({
                error: error
            });
        }
        else{
            res.status(500).json({
                error: error
            });
        }
    });
}

exports.get_blog = (req, res, next) => {
    Blog.findById(req.params.blogId)
    .populate('graff')
    .exec()
    .then(blog => {
        if (!blog){
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        res.status(200).json({
            blog: blog
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    });
}

exports.delete_blog = (req, res, next) => {
    Blog.deleteOne({_id:req.params.blogId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Blog deleted!',
        });
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: error});
    });
}