const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const moment = require('moment')


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let authorId = data.authorId
        if (Object.keys(data).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
        }
        if (!authorId) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
        }
        let authorDetails = await authorModel.findById(authorId)
        if (!authorDetails) {
            res.status(404).send({ status: false, msg: "author id not exist" })
        } else {
            let blogCreated = await blogModel.create(data)
            res.status(201).send({ status: true, data: blogCreated })
        }


    }  catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const getBlogs = async function (req, res) {
    try {
        let input = req.query
        let filters = Object.entries(input)
        let filtersAsObject = []
        for(let i=0 ; i<filters.length; i++){
            let element = filters[i]
            let obj = {}
            obj[element[0]] = element[1]
            filtersAsObject.push(obj)
        }
        let conditions = [{isDeleted : false}, {isPublished : true}]
        let finalFilters = conditions.concat(filtersAsObject)
           
        if (input) {
            let blogs = await blogModel.find({ $and : finalFilters})
            if (blogs.length == 0)
            res.status(400).send({ status: false, msg: "no blogs found" })
            res.status(200).send({ status: true, data: blogs })
        } else {
            let blogs = await blogModel.find({ $and : conditions })
            if (blogs.length == 0)
            res.status(404).send({ status: false, msg: "no blogs found" })
            res.status(200).send({ status: true, data: blogs })
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const updateBlog = async function (req, res) {
    let inputData = req.body
    let newTitle = req.body.title
    let newBody = req.body.body
    let newTag = req.body.tags
    let newSubCategory = req.body.subcategory
    let id = req.params["blogId"]
    try {
        if (Object.keys(inputData).length == 0)
        res.status(400).send({ status: false, msg: "please provide input data" })
        
        let blog = await blogModel.findByIdAndUpdate(
            { _id: id},
            { $set: { title: newTitle, body: newBody, isPublished: true, publishedAt: Date.now() }, $push: { tags: newTag, subcategory: newSubCategory } },
            { new: true }
        )
             res.status(200).send({ status: true, data: blog })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let id = req.params.blogId
        let deleted = await blogModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

        res.status(200).send(deleted)

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const deleteBlogQuery = async function (req, res) {
    try {
        let input = req.query
        
        if(Object.keys(input).length == 0)
        res.status(400).send({status: false, msg: "please provide input data" })
        let deletedBlog = await blogModel.updateMany({ $and: [input, { isDeleted: false }] }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
        
        res.status(200).send({msg: "Blog is already deleted"})
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery = deleteBlogQuery