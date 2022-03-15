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


    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }

}

const getBlogs = async function (req, res) {
    try {
        let authorId = req.query.authorId
        let category = req.query.category
        if (!authorId) {
            res.status(400).send({ status: false, msg: "author id is requires, BAD REQUEST" })
        } if (!category) {
            res.status(400).send({ status: false, msg: "category is required, BAD REQUEST" })
        }
        let authorDetails = await blogModel.find({ authorId: authorId })
        if (!authorDetails) {
            res.status(404).send({ status: false, msg: "auhtorId not exist" })
        }

        let blogDetails = await blogModel.find({ authorId: authorId, category: category, isDeleted: false, isPublished: true })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "no blogs found" })
        } else {
            res.status(200).send({ status: true, data: blogDetails })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
        }

        let blogDetails = await blogModel.find({ _id: blogId })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "blogId not exist" })
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let title = req.body.title
            let body = req.body.body
            // let tags = req.body.tags
            // let subcategory = req.body.subcategory
            await blogModel.updateMany({ _id: blogId }, { title: title, body: body, $push: { tags: ["Filmy"] }, $push: { subcategory: ["drama"] }, $set: { isPublished: true , publishedAt: Date } })
            let updatedDetails = await blogModel.find({ _id: blogId })
            res.status(201).send({ status: true, data: updatedDetails })
        }

    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogsId
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
        }
        let blogDetails = await blogModel.find({ _id: blogId }, { isDeleted: false })
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "blog not exist" })
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let blogDetails = await blogModel.updateMany({ _id: blogId }, { $set: { isDeleted: true , deletedAt: Date } })
            res.status(201).send({status:true})
            console.log(blogDetails)
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

const deleteBlogQuery = async function (req, res) {
    try {
        let authorId = req.query.authorId
        // let category = req.query.category
        if (!authorId) {
            res.status(400).send({ status: false, msg: "authorId is required, BAD REQUEST" })
        }
        // if (!category) {
        //     res.status(400).send({ status: false, msg: "category is required, BAD REQUEST" })
        // }
        let authorDetails = await authorModel.find({ _id: authorId })
        if (!authorDetails) {
            res.status(404).send({ status: false, msg: "authorId not exist" })
        } else {

            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            let updatedDetails = await blogModel.updateMany({ authorId: authorId,category: category}, { $set: { isDeleted: true , deletedAt: Date } })
            res.status(201).send({status: true})
            console.log(updatedDetails)
        }

    }
    catch (error) {
        console.log(error)
        res.staatus(500).send({ msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogQuery = deleteBlogQuery