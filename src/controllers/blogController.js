const { count } = require("console")
const moment = require('moment');
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

const createBlogs= async function (req, res) {
    try{
        let blog = req.body
        let author_id = req.body.authorId
        
        // To check data. As it should have the content
        if(Object.keys(blog) == 0)
        return res.status(400).send({status:false, msg: "Bad Request"})
        
        // If id not mentioned
        if(!author_id) {
            res.status(400).send({status: false, msg:"AuthorId is required"})
        }

        // To match id in author model
        let authorId = await authorModel.findById(author_id)
        if(!authorId) {
            res.status(400).send({status:false, msg: "No author is present with the given Id"})
        }

        // If everything is running successfully then status 201 success
        let blogsCreated = await blogModel.create(blog)
        res.status(201).send({data: blogsCreated})
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


const getBlog = async function (req, res) {
    try {
        const data = req.query
        if (Object.keys(data) == 0)
        res.status(400).send({ status: false, msg: "Data must be present" })

        const blogs = await blogModel.find(data, { isDeleted: false } && { isPublished: true }).populate("authorId")
        if (blogs.length == 0) {
            res.status(404).send({ status: false, msg: "No blogs found" })
        } else{
            res.status(200).send({ status: true, data: blogs });
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



const updateBlog = async function (req,res) {
    try{ 
        // To validate blog Id is present in request params
        let blogId = req.params.blogId
        if (!blogId) 
        res.status(400).send({ status: false, msg: "blogId must be present" })

        //To validate blogId is valid
        let blog = await blogModel.findById(blogId)
        if (!blog)
        res.status(404).send({ status: false, msg: "blog does not exists" })

        //If blogId exists
        let isDeleted = Object.keys(blog).find(isDeleted => blog[isDeleted] === true)
        if (isDeleted == true)
        res.status(404).send({ status: false, msg: "blog is deleted" })

        //Updates a blog by changing the its title, body, adding tags, adding a subcategory.
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {$set: { title: title, body: body, isPublished: true,  tags: tags, subcategory: subcategory}}, { new: true })
        
        //Sending the updated response
        res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!blogId)
        res.status(400).send({ status: false, msg: "Blog Id is required" })

        //Check if blogId exist.
        let blog = await blogModel.findById(blogId)
        if (!blog)
        res.status(404).send({ status: false, msg: "Blog does not exists" })

        //If the blogId is not deleted
        let isDeleted = Object.keys(blog).find(isDeleted => blog[isDeleted] === true)
        if (isDeleted === true)
        res.status(404).send({ status: false, msg: "Blog is deleted" })

        //If blogId exist, mark the blog as deleted (isDeleted: true)
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        res.status(200).send({ status: true, data: deletedBlog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const deleteBlogQuery = async function (req, res) {
    try {
        let input = req.query
        if(Object.keys(input).length == 0) return res.status(400).send({status: false, msg: "please provide input" })
    
            let deletedBlogs = await blogModel.updateMany({ $and: [input, { isDeleted: false }] }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
            
            res.status(200).send({status:true})
    
        } 
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

module.exports.createBlogs = createBlogs
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery = deleteBlogQuery