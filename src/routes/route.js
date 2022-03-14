const express = require('express');
const router = express.Router();

const authorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")

router.post("/authors", authorController.createAuthor)

router.post("/blogs", blogController.createBlogs)

router.get("/blogs", blogController.getBlog)

router.put("/blogs/:blogId", blogController.updateBlog)

router.delete("/blogs/:blogId", blogController.deleteBlog)

router.delete("/blogs", blogController.deleteBlogQuery)

module.exports = router;